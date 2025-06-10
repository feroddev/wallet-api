import { Injectable } from '@nestjs/common'
import { BillToPayRepository } from '../repositories/bill-to-pay.repository'

interface GetBillsRequest {
  userId: string
  isPaid?: boolean
  isRecurring?: boolean
  dueDateStart?: Date
  dueDateEnd?: Date
}

@Injectable()
export class GetBillsUseCase {
  constructor(private billToPayRepository: BillToPayRepository) {}

  async execute(request: GetBillsRequest) {
    const { userId, isPaid, isRecurring, dueDateStart, dueDateEnd } = request

    return this.billToPayRepository.findByUserId(userId, {
      isPaid,
      isRecurring,
      dueDateStart,
      dueDateEnd
    })
  }
}
