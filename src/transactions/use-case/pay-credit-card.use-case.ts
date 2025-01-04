import { Injectable, NotFoundException } from '@nestjs/common'
import { errors } from '../../../constants/errors'
import { CreditCardRepository } from '../../credit-card/repositories/credit-card.repository'
import { SplitOrRecurrenceRepository } from '../repositories/split-or-recurrence.repository'

@Injectable()
export class PayCreditCardUseCase {
  constructor(
    private readonly splitOrRecurrenceRepository: SplitOrRecurrenceRepository,
    private readonly creditCardRepository: CreditCardRepository
  ) {}

  async execute(creditCardId: string, userId: string, paidAt: Date) {
    const creditCard = await this.creditCardRepository.find({
      userId,
      id: creditCardId
    })

    if (!creditCard) {
      throw new NotFoundException(errors.CREDIT_CARD_NOT_FOUND)
    }

    return this.splitOrRecurrenceRepository.payByCreditCard(
      creditCardId,
      paidAt
    )
  }
}
