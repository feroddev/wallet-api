import { RecurringBill } from '@prisma/client'
import { RecurringBillDto } from '../dto'

export class RecurringBillMapper {
  static toDto(recurringBill: RecurringBill): RecurringBillDto {
    return {
      id: recurringBill.id,
      name: recurringBill.name,
      description: recurringBill.description,
      amount: Number(recurringBill.amount),
      recurrenceDay: recurringBill.recurrenceDay,
      createdAt: recurringBill.createdAt,
      updatedAt: recurringBill.updatedAt
    }
  }

  static toDtoList(recurringBills: RecurringBill[]): RecurringBillDto[] {
    return recurringBills.map(this.toDto)
  }
}
