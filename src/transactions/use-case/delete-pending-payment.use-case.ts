import { Injectable } from '@nestjs/common'
import { PendingPaymentsRepository } from '../repositories/pending-payments.repository'

@Injectable()
export class DeletePendingPaymentUseCase {
  constructor(
    private readonly pendingPaymentsRepository: PendingPaymentsRepository
  ) {}

  async execute(id: string, userId: string) {
    return this.pendingPaymentsRepository.delete(id, userId)
  }
}
