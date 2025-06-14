import { Injectable } from '@nestjs/common'
import { BillToPayRepository } from '../repositories/bill-to-pay.repository'

interface UpdateBillRequest {
  id: string
  userId: string
  name?: string
  description?: string
  amount?: number
  dueDate?: Date
  isRecurring?: boolean
  recurrenceDay?: number
}

@Injectable()
export class UpdateBillUseCase {
  constructor(private billToPayRepository: BillToPayRepository) {}

  async execute(request: UpdateBillRequest) {
    const {
      id,
      userId,
      name,
      description,
      amount,
      dueDate,
      isRecurring,
      recurrenceDay
    } = request

    const bill = await this.billToPayRepository.findById(id)

    if (!bill) {
      throw new Error('Conta não encontrada')
    }

    if (bill.userId !== userId) {
      throw new Error('Você não tem permissão para atualizar esta conta')
    }

    return this.billToPayRepository.update(id, {
      name,
      description,
      amount: amount as any,
      dueDate,
      isRecurring,
      recurrenceDay
    })
  }
}
