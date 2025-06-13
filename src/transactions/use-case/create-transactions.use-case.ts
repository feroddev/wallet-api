import { BadRequestException, Injectable } from '@nestjs/common'
import { PaymentStatus, Prisma } from '@prisma/client'
import { CreditCardRepository } from '../../credit-card/repositories/credit-card.repository'
import { PrismaService } from '../../prisma/prisma.service'
import { CreditCardExpenseDto } from '../infra/http/dto/create-credit-card-expense.dto'
import { CreatePendingPaymentDto } from '../infra/http/dto/create-pending-payment.dto'
import { CreateTransactionDto } from '../infra/http/dto/create-transaction.dto'
import { PaymentMethod, TransactionType } from '../infra/http/dto/enum'
import { CreditCardExpenseRepository } from '../repositories/credit-card-expense.repository'
import { PendingPaymentsRepository } from '../repositories/pending-payments.repository'
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

    return this.prisma.$transaction(async (transaction) => {
      if (data.paymentMethod === PaymentMethod.CREDIT_CARD) {
        return this.createCreditCardExpense(data, transaction, userId)
      }

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

    for (let i = 0; i < installments; i++) {
      const invoiceDate = this.calculateInvoiceDate(purchaseDate, creditCard.closingDay, creditCard.dueDay, i)
      const invoiceMonth = invoiceDate.getMonth() + 1
      const invoiceYear = invoiceDate.getFullYear()

      let invoice = await this.invoiceRepository.findByCreditCardIdAndMonth(
        creditCard.id,
        invoiceMonth,
        invoiceYear
      )

      if (!invoice) {
        invoice = await this.invoiceRepository.generateInvoice(
          creditCard.id,
          invoiceMonth,
          invoiceYear
        )
      }

      const transactionData = {
        userId,
        name: installments > 1 ? `${data.name} (${i+1}/${installments})` : data.name,
        description: data.description,
        totalAmount: installmentAmount,
        date: data.date,
        type: data.type,
        categoryId: data.categoryId,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        isPaid: false, 
        creditCardId: creditCard.id,
        invoiceId: invoice.id,
        installmentIndex: i + 1,
        totalInstallments: installments
      }

      const createdTransaction = await this.transactionsRepository.createWithTransaction({
        userId,
        data: transactionData,
        transaction
      })

      transactions.push(createdTransaction)
    }

    return {
      message: installments > 1 ? 'Compra parcelada criada com sucesso' : 'Compra com cartão de crédito criada com sucesso',
      count: transactions.length,
      transactions
    }
  }

  private calculateInvoiceDate(purchaseDate: Date, closingDay: number, dueDay: number, installmentOffset = 0): Date {
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
