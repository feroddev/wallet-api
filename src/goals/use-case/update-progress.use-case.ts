import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { GoalRepository } from '../repositories/goal.repository'
import { CategoryRepository } from '../../transactions/repositories/category.repository'
import { TransactionRepository } from '../../transactions/repositories/transaction.repository'
import { errors } from '../../../constants/errors'
import {
  PaymentMethod,
  TransactionType
} from '../../transactions/infra/http/dto/enum'
import { Decimal } from '@prisma/client/runtime/library'

interface UpdateProgressRequest {
  id: string
  userId: string
  amount: number
}

@Injectable()
export class UpdateProgressUseCase {
  constructor(
    private goalRepository: GoalRepository,
    private categoryRepository: CategoryRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute(request: UpdateProgressRequest) {
    const { id, userId, amount } = request

    const goalExists = await this.goalRepository.findById(id)

    if (!goalExists) {
      throw new NotFoundException(errors.GOAL_NOT_FOUND)
    }

    if (goalExists.userId !== userId) {
      throw new UnauthorizedException(errors.UNAUTHORIZED)
    }

    const goal = await this.goalRepository.updateProgress(id, amount)

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
      totalAmount: new Decimal(amount),
      isPaid: true,
      isRecurring: false
    })
  }
}
