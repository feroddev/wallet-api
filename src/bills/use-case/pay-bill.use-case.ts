import { Injectable } from '@nestjs/common'
import { BillToPayRepository } from '../repositories/bill-to-pay.repository'
import { TransactionRepository } from '../../transactions/repositories/transaction.repository'

interface PayBillRequest {
  id: string
  userId: string
}

@Injectable()
export class PayBillUseCase {
  constructor(
    private billToPayRepository: BillToPayRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute(request: PayBillRequest) {
    const { id, userId } = request

    const bill = await this.billToPayRepository.findById(id)
    
    if (!bill) {
      throw new Error('Conta não encontrada')
    }
    
    if (bill.userId !== userId) {
      throw new Error('Você não tem permissão para pagar esta conta')
    }

    if (bill.isPaid) {
      throw new Error('Esta conta já foi paga')
    }

    const paidBill = await this.billToPayRepository.markAsPaid(id)

    await this.transactionRepository.create({
      userId,
      description: `Pagamento: ${bill.name}`,
      value: bill.amount,
      type: 'EXPENSE',
      date: new Date(),
      categoryId: null,
      isRecurring: false
    } as any)

    if (bill.isRecurring) {
      await this.billToPayRepository.createRecurringBill(bill)
    }

    return paidBill
  }
}
