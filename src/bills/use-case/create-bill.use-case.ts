import { Injectable } from '@nestjs/common'
import { BillToPayRepository } from '../repositories/bill-to-pay.repository'

interface CreateBillRequest {
  userId: string
  name: string
  description?: string
  amount: number
  dueDate: Date
  isRecurring?: boolean
  recurrenceDay?: number
}

@Injectable()
export class CreateBillUseCase {
  constructor(private billToPayRepository: BillToPayRepository) {}

  async execute(request: CreateBillRequest) {
    const { userId, name, description, amount, dueDate, isRecurring, recurrenceDay } = request

    return this.billToPayRepository.create({
      userId,
      name,
      description,
      amount: amount as any,
      dueDate,
      isRecurring: isRecurring || false,
      recurrenceDay
    })
  }
}
