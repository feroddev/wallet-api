import { Injectable } from '@nestjs/common'
import { CreatePendingPaymentDto } from '../infra/http/dto/create-pending-payment.dto'
import { PendingPaymentsRepository } from '../repositories/pending-payments.repository'

@Injectable()
export class CreatePendingPaymentUseCase {
  constructor(
    private readonly pendingPaymentsRepository: PendingPaymentsRepository
  ) {}

  async execute(userId: string, data: CreatePendingPaymentDto) {
    return this.pendingPaymentsRepository.create(userId, data)
  }
}
