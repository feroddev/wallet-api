import { Injectable } from '@nestjs/common'
import { GetInvoicesDto } from '../../credit-card/infra/http/dto/get-invoice.dto'
import { SplitOrRecurrenceRepository } from '../repositories/credit-card-expense.repository'

@Injectable()
export class GetInvoicesUseCase {
  constructor(
    private readonly splitOrRecurrenceRepository: SplitOrRecurrenceRepository
  ) {}

  async execute(userId: string, creditCardId: string, query: GetInvoicesDto) {
    return this.splitOrRecurrenceRepository.findMany(
      userId,
      creditCardId,
      query
    )
  }
}
