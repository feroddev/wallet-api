import { Injectable } from '@nestjs/common'
import { PendingPaymentsRepository } from '../repositories/pending-payments.repository'

@Injectable()
export class FindPendingPaymentUseCase {
  constructor(
    private readonly pendingPaymentsRepository: PendingPaymentsRepository
  ) {}

  async execute(id: string, userId: string) {
    return this.pendingPaymentsRepository.findById(id, userId)
  }
}
