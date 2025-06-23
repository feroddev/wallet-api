import { Injectable, NotFoundException } from '@nestjs/common'
import { CreditCardRepository } from '../repositories/credit-card.repository'
import { errors } from '../../../constants/errors'

@Injectable()
export class DeleteCreditCardUseCase {
  constructor(private readonly creditCardRepository: CreditCardRepository) {}
  async execute(userId: string, creditCardId: string): Promise<void> {
    const creditCard = await this.creditCardRepository.find({
      id: creditCardId,
      userId
    })

    if (!creditCard) {
      throw new NotFoundException(errors.CREDIT_CARD_NOT_FOUND)
    }

    await this.creditCardRepository.delete(creditCardId)
  }
}
