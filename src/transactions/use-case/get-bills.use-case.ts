import { Injectable } from '@nestjs/common'
import { GetBillsDto } from '../../credit-card/infra/http/dto/get-bills.dto'
import { SplitOrRecurrenceRepository } from '../repositories/credit-card-expense.repository'

@Injectable()
export class GetBillsUseCase {
  constructor(
    private readonly splitOrRecurrenceRepository: SplitOrRecurrenceRepository
  ) {}

  async execute(userId: string, query: GetBillsDto) {
    return this.splitOrRecurrenceRepository.findBills(userId, query)
  }
}
