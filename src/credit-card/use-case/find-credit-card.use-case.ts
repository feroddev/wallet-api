import { Injectable, NotFoundException } from '@nestjs/common'
import { CreditCardRepository } from '../repositories/credit-card.repository'
import { errors } from '../../../constants/errors'

@Injectable()
export class FindCreditCardUseCase {
  constructor(private readonly creditCardRepository: CreditCardRepository) {}

  async execute(id: string, userId: string) {
    const creditCard = await this.creditCardRepository.find({
      id,
      userId
    })

    if (!creditCard) {
      throw new NotFoundException(errors.CREDIT_CARD_NOT_FOUND)
    }

    return creditCard
  }
}
