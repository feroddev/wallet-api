import { Injectable, NotFoundException } from '@nestjs/common'
import { GoalRepository } from '../repositories/goal.repository'
import { TransactionRepository } from '../../transactions/repositories/transaction.repository'
import { CategoryRepository } from '../../transactions/repositories/category.repository'
import {
  PaymentMethod,
  TransactionType
} from '../../transactions/infra/http/dto/enum'
import { Decimal } from '@prisma/client/runtime/library'
import { errors } from '../../../constants/errors'

interface CreateGoalRequest {
  userId: string
  name: string
  description?: string
  targetValue: number
  savedValue?: number
  deadline: Date
}

@Injectable()
export class CreateGoalUseCase {
  constructor(
    private goalRepository: GoalRepository,
    private transactionRepository: TransactionRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async execute(request: CreateGoalRequest) {
    const { userId, name, description, targetValue, savedValue, deadline } =
      request

    const goal = await this.goalRepository.create({
      name,
      description,
      targetValue,
      savedValue: savedValue || 0,
      deadline,
      userId
    })

    if (savedValue) {
      const category = await this.categoryRepository.find({
        name: 'Meta Financeira'
      })

      if (!category) {
        throw new NotFoundException(errors.CATEGORY_NOT_FOUND)
      }

      await this.transactionRepository.create({
        goalId: goal.id,
        categoryId: category.id,
        type: TransactionType.INVESTMENT,
        userId,
        name: goal.name,
        description: 'Investimento na meta',
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        date: new Date(),
        totalAmount: new Decimal(savedValue),
        isPaid: true,
        isRecurring: false
      })
    }

    return goal
  }
}
