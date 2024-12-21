import { Injectable, NotFoundException } from '@nestjs/common'
import { CreditCardRepository } from '../repositories/credit-card.repository'

@Injectable()
export class DeleteCreditCardUseCase {
  constructor(private readonly creditCardRepository: CreditCardRepository) {}
  async execute(userId: string, creditCardId: string): Promise<void> {
    const creditCard = await this.creditCardRepository.find({
      id: creditCardId,
      userId
    })

    if (!creditCard) {
      throw new NotFoundException('Credit card not found')
    }

    await this.creditCardRepository.delete(creditCardId)
  }
}
