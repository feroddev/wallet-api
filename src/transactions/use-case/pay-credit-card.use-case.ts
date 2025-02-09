import { Injectable, NotFoundException } from '@nestjs/common'
import { errors } from '../../../constants/errors'
import { CreditCardRepository } from '../../credit-card/repositories/credit-card.repository'
import { SplitOrRecurrenceRepository } from '../repositories/credit-card-expense.repository'

@Injectable()
export class PayCreditCardUseCase {
  constructor(
    private readonly splitOrRecurrenceRepository: SplitOrRecurrenceRepository,
    private readonly creditCardRepository: CreditCardRepository
  ) {}

  async execute({
    creditCardId,
    userId,
    paidAt,
    dueDate
  }: {
    creditCardId: string
    userId: string
    paidAt: Date
    dueDate: Date
  }) {
    const creditCard = await this.creditCardRepository.find({
      userId,
      id: creditCardId
    })

    if (!creditCard) {
      throw new NotFoundException(errors.CREDIT_CARD_NOT_FOUND)
    }

    return this.splitOrRecurrenceRepository.payByCreditCard({
      creditCardId,
      paidAt,
      dueDate
    })
  }
}
