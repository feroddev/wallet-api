import { Injectable, NotFoundException } from '@nestjs/common'
import { PaymentMethod, Prisma } from '@prisma/client'
import { CreateRecurringBillDto } from '../dto'
import { RecurringBillRepository } from '../repositories/recurring-bill.repository'
import { TransactionRepository } from '../../transactions/repositories/transaction.repository'
import { TransactionType } from '../../transactions/infra/http/dto/enum'
import { Decimal } from '@prisma/client/runtime/library'
import { CategoryRepository } from '../../transactions/repositories/category.repository'
import { PrismaService } from '../../prisma/prisma.service'
import { errors } from '../../../constants/errors'
import { DateUtils } from '../../utils/date.utils'

@Injectable()
export class CreateRecurringBillUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recurringBillRepository: RecurringBillRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(userId: string, dto: CreateRecurringBillDto) {
    const recurringBill = await this.recurringBillRepository.create(userId, dto)

    // Criar transação pendente para o mês atual
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Definir a data da transação com o dia de recorrência no mês atual
    const transactionDate = DateUtils.createLocalDate(
      currentYear,
      currentMonth,
      dto.recurrenceDay
    )

    // Se o dia de recorrência já passou neste mês, criar para o próximo mês
    if (transactionDate < currentDate) {
      transactionDate.setMonth(transactionDate.getMonth() + 1)
    }

    const category = await this.categoryRepository.find({
      name: 'Contas fixas'
    })

    await this.prisma.$transaction(async (transaction) => {
      await this.transactionRepository.createWithTransaction({
        userId,
        data: {
          categoryId: category.id,
          name: dto.name,
          description: dto.description,
          totalAmount: dto.amount,
          date: transactionDate.toISOString(),
          type: TransactionType.EXPENSE,
          paymentMethod: PaymentMethod.BANK_SLIP,
          isRecurring: true,
          isPaid: false,
          recurringBillId: recurringBill.id
        },
        transaction
      })
    })

    return recurringBill
  }
}
