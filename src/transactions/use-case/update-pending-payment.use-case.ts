import { Injectable } from '@nestjs/common'
import { UpdatePendingPaymentDto } from '../infra/http/dto/update-pending-payment.dto'
import { PendingPaymentsRepository } from '../repositories/pending-payments.repository'

@Injectable()
export class UpdatePendingPaymentUseCase {
  constructor(
    private readonly pendingPaymentsRepository: PendingPaymentsRepository
  ) {}

  async execute(id: string, userId: string, data: UpdatePendingPaymentDto) {
    return this.pendingPaymentsRepository.update(id, userId, data)
  }
}
