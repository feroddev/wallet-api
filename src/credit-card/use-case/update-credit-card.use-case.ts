import { Injectable, NotFoundException } from '@nestjs/common'
import { UpdateCreditCardDto } from '../infra/http/dto/update-credit-card.dto'
import { CreditCardRepository } from '../repositories/credit-card.repository'

@Injectable()
export class UpdateCreditCardUseCase {
  constructor(private readonly creditCardRepository: CreditCardRepository) {}
  async execute(
    userId: string,
    creditCardId: string,
    data: UpdateCreditCardDto
  ) {
    const creditCard = await this.creditCardRepository.find({
      id: creditCardId,
      userId
    })

    if (!creditCard) {
      throw new NotFoundException('Credit card not found')
    }

    return this.creditCardRepository.update(creditCardId, {
      ...data
    })
  }
}
