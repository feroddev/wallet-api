import { Injectable } from '@nestjs/common'
import { InstallmentRepository } from '../repositories/installment.repository'

@Injectable()
export class PayInstallmentUseCase {
  constructor(private readonly installmentRepository: InstallmentRepository) {}
  async execute(userId: string, installmentId: string) {
    return this.installmentRepository.update(installmentId, userId, {
      paymentStatus: 'PAID',
      paidAt: new Date()
    })
  }
}
