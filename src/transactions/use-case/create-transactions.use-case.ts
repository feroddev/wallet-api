import { BadRequestException, Injectable } from '@nestjs/common'
import { CreditCardRepository } from '../../credit-card/repositories/credit-card.repository'
import { PrismaService } from '../../prisma/prisma.service'
import { SplitOrRecurrenceDto } from '../infra/http/dto/create-split-or-recurrence.dto'
import { CreateTransactionDto } from '../infra/http/dto/create-transaction.dto'
import { PaymentMethod, SplitType } from '../infra/http/dto/enum'
import { SplitOrRecurrenceRepository } from '../repositories/split-or-recurrence.repository'
import { TransactionRepository } from '../repositories/transaction.repository'

@Injectable()
export class CreateTransactionsUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionsRepository: TransactionRepository,
    private readonly creditCardRepository: CreditCardRepository,
    private readonly splitOrRecurrenceRepository: SplitOrRecurrenceRepository
  ) {}

  async execute(userId: string, data: CreateTransactionDto) {
    this.validateTransactionData(data)

    return this.prisma.$transaction(async (transaction) => {
      const transactionCreated =
        await this.transactionsRepository.createWithTransaction(
          userId,
          data,
          transaction
        )

      if (
        data.isSplitOrRecurring &&
        data.paymentMethod === PaymentMethod.CREDIT_CARD
      ) {
        const creditCard = await this.creditCardRepository.find({
          id: data.creditCardId
        })

        if (!creditCard) {
          throw new BadRequestException('Cartão de crédito não encontrado')
        }

        const transactionDate = new Date(data.date)
        const firstInstallmentDate = new Date(
          transactionDate.getUTCFullYear(),
          transactionDate.getUTCMonth(),
          creditCard.dueDay
        )

        if (
          transactionDate.getUTCDate() >= creditCard.closingDay ||
          creditCard.closingDay > creditCard.dueDay
        ) {
          const isTwoMonths =
            creditCard.closingDay > creditCard.dueDay &&
            transactionDate.getUTCDate() >= creditCard.closingDay &&
            transactionDate.getUTCDate() < 32

          firstInstallmentDate.setMonth(
            firstInstallmentDate.getUTCMonth() + (isTwoMonths ? 2 : 1)
          )
        }

        const payload: SplitOrRecurrenceDto[] = Array.from({
          length: data.totalInstallments
        }).map((_, index) => {
          const installmentDate = new Date(firstInstallmentDate)
          installmentDate.setMonth(installmentDate.getUTCMonth() + index)

          return {
            amount: data.totalAmount / data.totalInstallments,
            transactionId: transactionCreated.id,
            installmentNumber: index + 1,
            totalInstallments: data.totalInstallments,
            type: SplitType.INSTALLMENT,
            dueDate: installmentDate.toISOString(),
            creditCardId: creditCard.id
          }
        })

        await this.splitOrRecurrenceRepository.createWithTransaction(
          payload,
          transaction
        )

        return transactionCreated
      }

      if (data.isSplitOrRecurring) {
        const payload: SplitOrRecurrenceDto[] = Array.from({
          length: 12
        }).map((_, index) => {
          const installmentDate = new Date(data.date)
          installmentDate.setMonth(installmentDate.getUTCMonth() + index)

          return {
            amount: data.totalAmount / data.totalInstallments,
            transactionId: transactionCreated.id,
            installmentNumber: index + 1,
            totalInstallments: data.totalInstallments,
            type: SplitType.RECURRING,
            dueDate: installmentDate.toISOString()
          }
        })

        await this.splitOrRecurrenceRepository.createWithTransaction(
          payload,
          transaction
        )

        return transactionCreated
      }
    })
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
  }
}
