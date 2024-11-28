import { Injectable } from '@nestjs/common'
import { CreateCreditCardDto } from '../infra/http/dto/create-credit-card.dto'
import { CreditCardRepository } from '../repositories/credit-card.repository'

@Injectable()
export class CreateCreditCardUseCase {
  constructor(private readonly creditCardRepository: CreditCardRepository) {}
  async execute(userId: string, data: CreateCreditCardDto) {
    return this.creditCardRepository.create(userId, data)
  }
}
