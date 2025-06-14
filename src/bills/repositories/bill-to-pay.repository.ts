import { BillToPay } from '@prisma/client'

export abstract class BillToPayRepository {
  abstract create(data: Partial<BillToPay>): Promise<BillToPay>
  abstract findById(id: string): Promise<BillToPay | null>
  abstract findByUserId(
    userId: string,
    filters?: {
      isPaid?: boolean
      isRecurring?: boolean
      dueDateStart?: Date
      dueDateEnd?: Date
    }
  ): Promise<BillToPay[]>
  abstract update(id: string, data: Partial<BillToPay>): Promise<BillToPay>
  abstract delete(id: string): Promise<void>
  abstract markAsPaid(id: string): Promise<BillToPay>
  abstract createRecurringBill(originalBill: BillToPay): Promise<BillToPay>
}
