import { Injectable } from '@nestjs/common'
import { PaymentMethod } from '@prisma/client'
import { CreateTransactionDto } from '../infra/http/dto/create-transaction.dto'
import { InstallmentRepository } from '../repositories/installment.repository'
import { TransactionRepository } from '../repositories/transaction.repository'

@Injectable()
export class CreateTransactionsUseCase {
  constructor(
    private readonly transactionsRepository: TransactionRepository,
    private readonly installmentsRepository: InstallmentRepository
  ) {}

  private async createTransactions(userId: string, data: CreateTransactionDto) {
    const transaction = await this.transactionsRepository.create(userId, {
      categoryId: data.categoryId,
      description: data.description,
      isInstallment: false,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod
    })

    return transaction
  }

  private async createTransactionsWithInstallments(
    userId: string,
    data: CreateTransactionDto
  ) {
    const totalInstallments = data.totalInstallments || 1

    const transaction = await this.transactionsRepository.create(userId, {
      categoryId: data.categoryId,
      creditCardId: data.creditCardId,
      description: data.description,
      totalAmount: data.totalAmount,
      totalInstallments: totalInstallments,
      paymentMethod: data.paymentMethod
    })

    const installmentAmount = data.totalAmount / totalInstallments

    for (let i = 0; i < totalInstallments; i++) {
      const nextDueDate = new Date(data.dueDate)
      nextDueDate.setMonth(nextDueDate.getMonth() + i)
      await this.installmentsRepository.create({
        transactionId: transaction.id,
        installmentNumber: i + 1,
        amount: installmentAmount,
        dueDate: nextDueDate
      })
    }

    return transaction
  }

  private async createTransactionsBankSlip(
    userId: string,
    data: CreateTransactionDto
  ) {
    const transaction = await this.transactionsRepository.create(userId, {
      categoryId: data.categoryId,
      description: data.description,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod
    })

    await this.installmentsRepository.create({
      transactionId: transaction.id,
      installmentNumber: 1,
      amount: data.totalAmount,
      dueDate: data.dueDate
    })

    return transaction
  }

  private async mapper(
    paymentMethod: PaymentMethod,
    userId: string,
    data: CreateTransactionDto
  ) {
    const paymentMethodMapper = {
      CREDIT_CARD: this.createTransactionsWithInstallments(userId, data),
      DEBIT_CARD: this.createTransactions(userId, data),
      CASH: this.createTransactions(userId, data),
      BANK_SLIP: this.createTransactionsBankSlip(userId, data),
      BANK_TRANSFER: this.createTransactions(userId, data),
      PIX: this.createTransactions(userId, data),
      OTHER: this.createTransactions(userId, data)
    }

    return paymentMethodMapper[paymentMethod]
  }

  async execute(userId: string, data: CreateTransactionDto) {
    const { paymentMethod } = data
    return this.mapper(paymentMethod, userId, data)
  }
}
