import { Injectable } from '@nestjs/common'
import { PaymentMethod, Prisma } from '@prisma/client'
import { CreateRecurringBillDto } from '../dto'
import { RecurringBillRepository } from '../repositories/recurring-bill.repository'
import { TransactionRepository } from '../../transactions/repositories/transaction.repository'
import { TransactionType } from '../../transactions/infra/http/dto/enum'

@Injectable()
export class CreateRecurringBillUseCase {
  constructor(
    private recurringBillRepository: RecurringBillRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute(userId: string, dto: CreateRecurringBillDto) {
    const recurringBill = await this.recurringBillRepository.create(userId, dto)
    
    // Criar transação pendente para o mês atual
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    
    // Definir a data da transação com o dia de recorrência no mês atual
    const transactionDate = new Date(currentYear, currentMonth, dto.recurrenceDay)
    
    // Se o dia de recorrência já passou neste mês, criar para o próximo mês
    if (transactionDate < currentDate) {
      transactionDate.setMonth(transactionDate.getMonth() + 1)
    }
    
    // Criar a transação pendente
    await this.transactionRepository.create({
      userId,
      name: dto.name,
      description: dto.description,
      totalAmount: new Prisma.Decimal(dto.amount),
      date: transactionDate,
      type: TransactionType.EXPENSE,
      paymentMethod: PaymentMethod.BANK_SLIP,
      isRecurring: true,
      isPaid: false,
      recurringBillId: recurringBill.id
    })
    
    return recurringBill
  }
}
