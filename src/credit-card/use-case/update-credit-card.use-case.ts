import { Injectable, NotFoundException } from '@nestjs/common'
import { Decimal } from '@prisma/client/runtime/library'
import { CreateCreditCardDto } from '../infra/http/dto/create-credit-card.dto'
import { CreditCardRepository } from '../repositories/credit-card.repository'

@Injectable()
export class UpdateCreditCardUseCase {
  constructor(private readonly creditCardRepository: CreditCardRepository) {}
  async execute(
    userId: string,
    creditCardId: string,
    data: Partial<CreateCreditCardDto>
  ) {
    const creditCard = await this.creditCardRepository.find({
      id: creditCardId,
      userId
    })

    if (!creditCard) {
      throw new NotFoundException('Credit card not found')
    }

    return this.creditCardRepository.update(creditCardId, {
      ...data,
      limit: new Decimal(data.limit)
    })
  }
}
