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
      transactionDate: data.transactionDate,
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
    const totalInstallments = data.totalInstallments
    const transaction = await this.transactionsRepository.create(userId, {
      transactionDate: data.transactionDate,
      categoryId: data.categoryId,
      creditCardId: data.creditCardId,
      description: data.description,
      totalAmount: data.totalAmount,
      isInstallment: true,
      totalInstallments: totalInstallments,
      paymentMethod: data.paymentMethod
    })
    const installmentAmount = data.totalAmount / totalInstallments
    const installments = Array.from({ length: totalInstallments }).map(
      (_, index) => {
        const nextDueDate = new Date(data.dueDate)
        nextDueDate.setMonth(nextDueDate.getMonth() + index)
        return {
          transactionId: transaction.id,
          installmentNumber: index + 1,
          amount: installmentAmount,
          dueDate: nextDueDate
        }
      }
    )
    await this.installmentsRepository.createMany(installments)
    return transaction
  }

  private async createTransactionsBankSlip(
    userId: string,
    data: CreateTransactionDto
  ) {
    const transaction = await this.transactionsRepository.create(userId, {
      transactionDate: data.transactionDate,
      categoryId: data.categoryId,
      description: data.description,
      isInstallment: true,
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

  private async transactionFunctionMapper(paymentMethod: PaymentMethod) {
    const paymentMethodMapper = {
      CREDIT_CARD: this.createTransactionsWithInstallments.bind(this),
      DEBIT_CARD: this.createTransactions.bind(this),
      CASH: this.createTransactions.bind(this),
      BANK_SLIP: this.createTransactionsBankSlip.bind(this),
      BANK_TRANSFER: this.createTransactions.bind(this),
      PIX: this.createTransactions.bind(this),
      OTHER: this.createTransactions.bind(this)
    }

    const transactionFunction = await paymentMethodMapper[paymentMethod]

    return transactionFunction
  }

  async execute(userId: string, data: CreateTransactionDto) {
    const { paymentMethod } = data
    const transaction = await this.transactionFunctionMapper(paymentMethod)
    return transaction(userId, data)
  }
}
