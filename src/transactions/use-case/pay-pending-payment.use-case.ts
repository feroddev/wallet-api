import { Injectable } from '@nestjs/common'
import { PayPendingPaymentDto } from '../infra/http/dto/pay-pending-payment.dto'
import { PendingPaymentsRepository } from '../repositories/pending-payments.repository'

@Injectable()
export class PayPendingPaymentUseCase {
  constructor(
    private readonly pendingPaymentsRepository: PendingPaymentsRepository
  ) {}

  async execute(id: string, userId: string, data: PayPendingPaymentDto) {
    return this.pendingPaymentsRepository.payPendingPayment(id, userId, data)
  }
}
