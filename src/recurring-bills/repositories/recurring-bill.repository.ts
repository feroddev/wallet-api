import { RecurringBill } from '@prisma/client'
import { CreateRecurringBillDto, UpdateRecurringBillDto } from '../dto'

export abstract class RecurringBillRepository {
  abstract create(
    userId: string,
    data: CreateRecurringBillDto
  ): Promise<RecurringBill>
  abstract findAll(userId: string): Promise<RecurringBill[]>
  abstract findById(id: string, userId: string): Promise<RecurringBill | null>
  abstract update(
    id: string,
    data: UpdateRecurringBillDto
  ): Promise<RecurringBill>
  abstract delete(id: string): Promise<RecurringBill>
  abstract findPendingForMonth(
    userId: string,
    month: number,
    year: number
  ): Promise<RecurringBill[]>
}
