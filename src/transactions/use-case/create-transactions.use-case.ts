import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CreditCardRepository } from '../../credit-card/repositories/credit-card.repository'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateTransactionDto } from '../infra/http/dto/create-transaction.dto'
import { PaymentMethod } from '../infra/http/dto/enum'
import { TransactionRepository } from '../repositories/transaction.repository'
import { InvoiceRepository } from '../../invoices/repositories/invoice.repository'

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

  private async createCreditCardExpense(
    data: CreateTransactionDto,
    transaction: Prisma.TransactionClient,
    userId: string
  ) {
    const creditCard = await this.creditCardRepository.find({
      id: data.creditCardId
    })

    if (!creditCard) {
      throw new BadRequestException('Cartão de crédito não encontrado')
    }

    const purchaseDate = new Date(data.date)
    const installments = data.totalInstallments || 1
    const installmentAmount = data.totalAmount / installments
    const transactions = []

    // Gerar um ID único para a compra parcelada
    const purchaseId =
      data.purchaseId ||
      `purchase-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // Pré-calcular todas as faturas necessárias para evitar consultas repetidas
    const invoiceDates = []
    const invoiceCache = new Map()

    for (let i = 0; i < installments; i++) {
      const invoiceDate = this.calculateInvoiceDate(
        purchaseDate,
        creditCard.closingDay,
        creditCard.dueDay,
        i
      )
      const invoiceMonth = invoiceDate.getMonth() + 1
      const invoiceYear = invoiceDate.getFullYear()
      invoiceDates.push({ month: invoiceMonth, year: invoiceYear })
    }

    // Buscar todas as faturas existentes de uma vez
    const uniqueDates = [
      ...new Set(invoiceDates.map((d) => `${d.month}-${d.year}`))
    ]
    for (const dateKey of uniqueDates) {
      const [month, year] = dateKey.split('-').map(Number)
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

      invoiceCache.set(dateKey, invoice)
    }

    // Criar todas as transações em lote e atualizar os valores das faturas
    const transactionsData = []
    const invoiceUpdates = new Map()

    const originalPurchaseDate = new Date(data.date)

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

      const transactionData = {
        userId,
        name:
          installments > 1
            ? `${data.name} (${i + 1}/${installments})`
            : data.name,
        description: data.description,
        totalAmount: installmentAmount,
        date: installmentDate.toISOString(),
        type: data.type,
        categoryId: data.categoryId,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        isPaid: false,
        creditCardId: creditCard.id,
        invoiceId: invoice.id,
        purchaseId: purchaseId,
        totalInstallments: installments,
        installmentNumber: i + 1
      }

      const createdTransaction =
        await this.transactionsRepository.createWithTransaction({
          userId,
          data: transactionData,
          transaction
        })

      transactions.push(createdTransaction)

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

    // Atualizar os valores totais das faturas
    for (const [invoiceId, amountToAdd] of invoiceUpdates.entries()) {
      await transaction.invoice.update({
        where: { id: invoiceId },
        data: {
          totalAmount: {
            increment: amountToAdd
          }
        }
      })
    }

    return {
      message:
        installments > 1
          ? 'Compra parcelada criada com sucesso'
          : 'Compra com cartão de crédito criada com sucesso',
      count: transactions.length,
      transactions
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
    const installmentDate = new Date(
      installmentYear,
      installmentMonth,
      purchaseDay
    )

    // Verificar se o dia existe no mês (ex: 31 de fevereiro não existe)
    const lastDayOfMonth = new Date(
      installmentYear,
      installmentMonth + 1,
      0
    ).getDate()
    if (purchaseDay > lastDayOfMonth) {
      // Se o dia não existir, usamos o último dia do mês
      installmentDate.setDate(lastDayOfMonth)
    }

    return installmentDate
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

    if (purchaseDay > closingDay) {
      invoiceMonth += 1
    }

    invoiceMonth += installmentOffset

    while (invoiceMonth > 11) {
      invoiceMonth -= 12
      invoiceYear += 1
    }

    const invoiceDate = new Date(invoiceYear, invoiceMonth, dueDay)
    return invoiceDate
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
