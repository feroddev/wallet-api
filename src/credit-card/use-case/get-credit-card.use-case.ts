import { Injectable } from '@nestjs/common'
import { CreditCardRepository } from '../repositories/credit-card.repository'

@Injectable()
export class GetCreditCardUseCase {
  constructor(private readonly creditCardRepository: CreditCardRepository) {}

  async execute(userId: string) {
    return this.creditCardRepository.findMany({ userId })
  }
}
