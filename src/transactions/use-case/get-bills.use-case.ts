import { Injectable } from '@nestjs/common'
import { GetBillsDto } from '../../credit-card/infra/http/dto/get-bills.dto'
import { PendingPaymentsRepository } from '../repositories/pending-payments.repository'

@Injectable()
export class GetBillsUseCase {
  constructor(
    private readonly pendingPaymentsRepository: PendingPaymentsRepository
  ) {}

  async execute(userId: string, query: GetBillsDto) {
    return this.pendingPaymentsRepository.findBills(userId, query)
  }
}
