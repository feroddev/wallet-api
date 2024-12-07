import { Injectable } from '@nestjs/common'
import { SplitOrRecurrenceRepository } from '../../transactions/repositories/split-or-recurrence.repository'
import { GetInvoicesDto } from '../infra/http/dto/get-invoice.dto'

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
