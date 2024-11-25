import { PaymentMethod, RecurrenceInterval } from '@prisma/client'

export class CreateTransactionDto {
  categoryId: string
  creditCardId?: string
  description: string
  totalAmount: number
  isInstallment?: boolean
  totalInstallments?: number
  isRecurring?: boolean
  recurrenceInterval?: RecurrenceInterval
  recurrenceStart?: Date
  recurrenceEnd?: Date
  paymentMethod: PaymentMethod
}
