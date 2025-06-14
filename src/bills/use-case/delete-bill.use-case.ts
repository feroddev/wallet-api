import { Injectable } from '@nestjs/common'
import { BillToPayRepository } from '../repositories/bill-to-pay.repository'

interface DeleteBillRequest {
  id: string
  userId: string
}

@Injectable()
export class DeleteBillUseCase {
  constructor(private billToPayRepository: BillToPayRepository) {}

  async execute(request: DeleteBillRequest) {
    const { id, userId } = request

    const bill = await this.billToPayRepository.findById(id)

    if (!bill) {
      throw new Error('Conta não encontrada')
    }

    if (bill.userId !== userId) {
      throw new Error('Você não tem permissão para excluir esta conta')
    }

    await this.billToPayRepository.delete(id)
  }
}
