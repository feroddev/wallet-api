import { Injectable, NotFoundException } from '@nestjs/common'
import { CreditCardRepository } from '../repositories/credit-card.repository'

@Injectable()
export class FindCreditCardUseCase {
  constructor(private readonly creditCardRepository: CreditCardRepository) {}

  async execute(id: string, userId: string) {
    const creditCard = await this.creditCardRepository.find({
      id,
      userId
    })

    if (!creditCard) {
      throw new NotFoundException('Credit card not found')
    }

    return creditCard
  }
}
