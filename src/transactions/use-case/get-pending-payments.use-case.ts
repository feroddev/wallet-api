import { Injectable } from '@nestjs/common'
import { GetPendingPaymentsDto } from '../infra/http/dto/get-pending-payments.dto'
import { PendingPaymentsRepository } from '../repositories/pending-payments.repository'

@Injectable()
export class GetPendingPaymentsUseCase {
  constructor(
    private readonly pendingPaymentsRepository: PendingPaymentsRepository
  ) {}

  async execute(userId: string, filters: GetPendingPaymentsDto) {
    return this.pendingPaymentsRepository.findAll(userId, filters)
  }
}
