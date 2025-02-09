import { Injectable } from '@nestjs/common'
import { PendingPaymentsRepository } from '../repositories/pending-payments.repository'

@Injectable()
export class PaidSplitOrRecurrencyUseCase {
  constructor(
    private readonly pendingPaymentsRepository: PendingPaymentsRepository
  ) {}

  async execute(id: string, paidAt: Date) {
    return this.pendingPaymentsRepository.payPendingPayments(id, paidAt)
  }
}
