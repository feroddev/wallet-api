import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, PaymentMethod, TransactionType } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { TransactionRepository } from '../repositories/transaction.repository'
import { CreateTransactionDto } from '../infra/http/dto/create-transaction.dto'
import { CreditCardRepository } from '../../credit-card/repositories/credit-card.repository'
import { InvoiceRepository } from '../../invoices/repositories/invoice.repository'
import { errors } from '../../../constants/errors'
import { DateUtils } from '../../utils/date.utils'

@Injectable()
export class CreateTransactionsUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionsRepository: TransactionRepository,
    private readonly creditCardRepository: CreditCardRepository,
    private readonly invoiceRepository: InvoiceRepository
  ) {}

  async execute(userId: string, data: CreateTransactionDto) {
    this.validateTransactionData(data)

    // Aplica regras de pagamento automático
    this.applyPaymentRules(data)

    if (data.paymentMethod === PaymentMethod.CREDIT_CARD) {
      return this.prisma.executeWithExtendedTimeout(async () => {
        return this.prisma.$transaction(
          async (transaction) => {
            return this.createCreditCardExpense(data, transaction, userId)
          },
          {
            timeout: 60000, // 60 segundos para transações com cartão de crédito
            maxWait: 20000 // 20 segundos de espera máxima
          }
        )
      })
    }

    return this.prisma.$transaction(async (transaction) => {
      if (data.paymentMethod === PaymentMethod.BANK_SLIP) {
        return this.createBankSlipExpense(data, transaction, userId)
      }

      const transactionCreated =
        await this.transactionsRepository.createWithTransaction({
          userId,
          data,
          transaction
        })

      return transactionCreated
    })
  }

  private async createBankSlipExpense(
    data: CreateTransactionDto,
    transaction: Prisma.TransactionClient,
    userId: string
  ) {
    const bankSlip = await this.transactionsRepository.createWithTransaction({
      userId,
      data,
      transaction
    })

    return {
      message: 'Pagamento pendente criado com sucesso',
      bankSlip
    }
  }

  /**
   * Aplica regras de pagamento automático:
   * - Transações do tipo INCOME são sempre pagas
   * - Transações com data anterior são sempre pagas
   * - Transações do dia atual são pagas apenas se forem criadas até as 23h
   * - Transações futuras que não sejam INCOME podem ser não pagas
   */
  private applyPaymentRules(data: CreateTransactionDto) {
    const currentDateTime = new Date()
    const currentDate = new Date(currentDateTime)
    currentDate.setHours(0, 0, 0, 0)

    const currentHour = currentDateTime.getHours()

    const transactionDate = new Date(data.date)
    transactionDate.setHours(0, 0, 0, 0)

    const tomorrow = new Date(currentDate)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Se for receita, marca como pago
    if (data.type === TransactionType.INCOME) {
      data.isPaid = true
      return
    }

    // Se for cartão de crédito, não marca como pago automaticamente
    if (data.paymentMethod === PaymentMethod.CREDIT_CARD) {
      return
    }

    // Para datas passadas, sempre marca como pago
    if (transactionDate < currentDate) {
      data.isPaid = true
      return
    }

    // Para o dia atual, marca como pago apenas se for antes das 23h
    if (transactionDate.getTime() === currentDate.getTime()) {
      if (currentHour < 23) {
        data.isPaid = true
      }
      return
    }
  }

  private async createCreditCardExpense(
    data: CreateTransactionDto,
    transaction: Prisma.TransactionClient,
    userId: string
  ) {
    const creditCard = await this.creditCardRepository.find({
      id: data.creditCardId
    })

    if (!creditCard) {
      throw new NotFoundException(errors.CREDIT_CARD_NOT_FOUND)
    }

    const installments = data.totalInstallments || 1
    const installmentAmount = data.totalAmount / installments
    const totalAmount = data.totalAmount

    // Verificar limite do cartão se estiver definido
    if (creditCard.limit) {
      // Buscar todas as faturas em aberto para este cartão
      const pendingInvoices =
        await this.invoiceRepository.findPendingByCreditCardId(creditCard.id)

      // Calcular o valor total já comprometido em faturas
      const totalCommitted = pendingInvoices.reduce(
        (sum, invoice) => sum + Number(invoice.totalAmount),
        0
      )

      // Verificar se a nova transação ultrapassa o limite
      if (totalCommitted + totalAmount > Number(creditCard.limit)) {
        throw new BadRequestException(
          'Esta transação ultrapassa o limite disponível do cartão. ' +
            'O limite do cartão é de R$' +
            creditCard.limit +
            ' e o valor comprometido é de R$' +
            totalCommitted
        )
      }
    }

    // Gerar um ID único para a compra parcelada
    const purchaseId =
      data.purchaseId ||
      `purchase-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // Preparar dados para processamento em lote
    const invoiceDatesMap = new Map()
    const transactionsToCreate = []
    const invoiceUpdates = new Map()
    const originalPurchaseDate = new Date(data.date)

    // Pré-calcular todas as datas de parcelas e faturas
    for (let i = 0; i < installments; i++) {
      const installmentDate = this.calculateInstallmentDate(
        originalPurchaseDate,
        i
      )
      const invoiceDate = this.calculateInvoiceDate(
        installmentDate,
        creditCard.closingDay,
        creditCard.dueDay
      )
      const invoiceMonth = invoiceDate.getMonth() + 1
      const invoiceYear = invoiceDate.getFullYear()
      const dateKey = `${invoiceMonth}-${invoiceYear}`

      if (!invoiceDatesMap.has(dateKey)) {
        invoiceDatesMap.set(dateKey, { month: invoiceMonth, year: invoiceYear })
      }
    }

    // Buscar ou criar todas as faturas necessárias em paralelo
    const invoiceDates = Array.from(invoiceDatesMap.values())
    const invoicePromises = invoiceDates.map(async ({ month, year }) => {
      let invoice = await this.invoiceRepository.findByCreditCardIdAndMonth(
        creditCard.id,
        month,
        year
      )

      if (!invoice) {
        invoice = await this.invoiceRepository.generateInvoice(
          creditCard.id,
          month,
          year
        )
      }

      return { key: `${month}-${year}`, invoice }
    })

    const invoiceResults = await Promise.all(invoicePromises)
    const invoiceCache = new Map()
    invoiceResults.forEach(({ key, invoice }) => {
      invoiceCache.set(key, invoice)
    })

    // Preparar dados para criação em lote
    for (let i = 0; i < installments; i++) {
      const installmentDate = this.calculateInstallmentDate(
        originalPurchaseDate,
        i
      )
      const invoiceDate = this.calculateInvoiceDate(
        installmentDate,
        creditCard.closingDay,
        creditCard.dueDay,
        0
      )
      const invoiceMonth = invoiceDate.getMonth() + 1
      const invoiceYear = invoiceDate.getFullYear()
      const dateKey = `${invoiceMonth}-${invoiceYear}`
      const invoice = invoiceCache.get(dateKey)

      // Para transações de cartão de crédito, apenas receitas são marcadas como pagas automaticamente
      // Outras transações de cartão de crédito nunca são marcadas como pagas automaticamente
      const isPaidInstallment = data.type === TransactionType.INCOME

      transactionsToCreate.push({
        userId,
        name:
          installments > 1
            ? `${data.name} (${i + 1}/${installments})`
            : data.name,
        description: data.description,
        totalAmount: installmentAmount,
        date: installmentDate,
        type: data.type,
        categoryId: data.categoryId,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        isPaid: isPaidInstallment,
        creditCardId: creditCard.id,
        invoiceId: invoice.id,
        purchaseId: purchaseId,
        totalInstallments: installments,
        installmentNumber: i + 1
      })

      // Registrar o valor para atualização da fatura
      if (!invoiceUpdates.has(invoice.id)) {
        invoiceUpdates.set(invoice.id, installmentAmount)
      } else {
        invoiceUpdates.set(
          invoice.id,
          invoiceUpdates.get(invoice.id) + installmentAmount
        )
      }
    }

    // Criar todas as transações de uma vez usando createMany
    await transaction.transaction.createMany({
      data: transactionsToCreate
    })

    // Buscar as transações criadas para retornar ao cliente
    const createdTransactions = await transaction.transaction.findMany({
      where: {
        purchaseId: purchaseId
      },
      orderBy: {
        installmentNumber: 'asc'
      }
    })

    // Atualizar os valores totais das faturas em paralelo
    const invoiceUpdatePromises = Array.from(invoiceUpdates.entries()).map(
      ([invoiceId, amountToAdd]) =>
        transaction.invoice.update({
          where: { id: invoiceId },
          data: {
            totalAmount: {
              increment: amountToAdd
            }
          }
        })
    )

    await Promise.all(invoiceUpdatePromises)

    return {
      message:
        installments > 1
          ? 'Compra parcelada criada com sucesso'
          : 'Compra com cartão de crédito criada com sucesso',
      count: createdTransactions.length,
      transactions: createdTransactions
    }
  }

  private calculateInstallmentDate(
    purchaseDate: Date,
    installmentOffset: number
  ): Date {
    const purchaseDay = purchaseDate.getDate()
    const purchaseMonth = purchaseDate.getMonth()
    const purchaseYear = purchaseDate.getFullYear()

    let installmentMonth = purchaseMonth
    let installmentYear = purchaseYear

    // Para a primeira parcela (offset 0), usamos a data original da compra
    // Para as demais parcelas, adicionamos meses
    installmentMonth += installmentOffset

    while (installmentMonth > 11) {
      installmentMonth -= 12
      installmentYear += 1
    }

    // Criamos a data com o mesmo dia da compra original, mas no mês seguinte
    // Preservamos o fuso horário usando o utilitário de datas
    const installmentDate = DateUtils.createDateInMonth(
      purchaseDate,
      installmentMonth,
      installmentYear
    )

    // Verificar se o dia existe no mês (ex: 31 de fevereiro não existe)
    return DateUtils.setDayOfMonth(installmentDate, purchaseDay)
  }

  private calculateInvoiceDate(
    purchaseDate: Date,
    closingDay: number,
    dueDay: number,
    installmentOffset = 0
  ): Date {
    const purchaseDay = purchaseDate.getDate()
    const purchaseMonth = purchaseDate.getMonth()
    const purchaseYear = purchaseDate.getFullYear()

    let invoiceMonth = purchaseMonth
    let invoiceYear = purchaseYear

    // Se o dia da compra for maior que o dia de fechamento, a compra vai para a fatura do próximo mês
    // Comparamos com o dia atual para decisões mais precisas sobre a fatura
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Se estamos no mesmo mês/ano da compra e o dia atual já passou do fechamento
    if (currentMonth === purchaseMonth && currentYear === purchaseYear && currentDay > closingDay) {
      invoiceMonth += 1;
    }
    // Ou se o dia da compra é posterior ao fechamento
    else if (purchaseDay > closingDay) {
      invoiceMonth += 1;
    }

    invoiceMonth += installmentOffset

    while (invoiceMonth > 11) {
      invoiceMonth -= 12
      invoiceYear += 1
    }

    // Criamos a data da fatura preservando o fuso horário local usando o utilitário de datas
    const invoiceDate = DateUtils.createDateInMonth(purchaseDate, invoiceMonth, invoiceYear);
    return DateUtils.setDayOfMonth(invoiceDate, dueDay);
  }

  private validateTransactionData(data: CreateTransactionDto) {
    if (
      data.paymentMethod === PaymentMethod.CREDIT_CARD &&
      !data.creditCardId
    ) {
      throw new BadRequestException(
        'Precisa informar o cartão de crédito para pagamento com cartão de crédito'
      )
    }

    if (
      data.paymentMethod === PaymentMethod.CREDIT_CARD &&
      (!data.totalInstallments || data.totalInstallments < 1)
    ) {
      data.totalInstallments = 1
    }
  }
}
