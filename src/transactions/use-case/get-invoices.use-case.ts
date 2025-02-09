import { Injectable } from '@nestjs/common'
import { GetInvoicesDto } from '../../credit-card/infra/http/dto/get-invoice.dto'
import { CreditCardExpenseRepository } from '../repositories/credit-card-expense.repository'

@Injectable()
export class GetInvoicesUseCase {
  constructor(
    private readonly creditCardExpenseRepository: CreditCardExpenseRepository
  ) {}

  async execute(userId: string, creditCardId: string, query: GetInvoicesDto) {
    return this.creditCardExpenseRepository.findMany(
      userId,
      creditCardId,
      query
    )
  }
}
