import { Invoice, PaymentMethod, Prisma } from '@prisma/client'

export abstract class InvoiceRepository {
  abstract create(data: Partial<Invoice>): Promise<Invoice>

  abstract findById(id: string): Promise<Invoice | null>

  abstract getInvoicesWithTransactions(
    userId: string
  ): Promise<{ paid: Invoice[]; pending: Invoice[] }>

  abstract findByUserIdAndMonth(
    userId: string,
    month: number,
    year: number
  ): Promise<Invoice[]>

  abstract findByCreditCardIdAndMonth(
    creditCardId: string,
    month: number,
    year: number
  ): Promise<Invoice | null>

  abstract findPendingByCreditCardId(creditCardId: string): Promise<Invoice[]>

  abstract update(id: string, data: Partial<Invoice>): Promise<Invoice>

  abstract generateInvoice(
    creditCardId: string,
    month: number,
    year: number
  ): Promise<Invoice>

  abstract markAsPaid(
    id: string,
    paymentMethod: PaymentMethod,
    paidAt: Date
  ): Promise<Invoice>

  abstract markAsPaidWithTransaction(
    id: string,
    paymentMethod: PaymentMethod,
    paidAt: Date,
    transaction: Prisma.TransactionClient
  ): Promise<Invoice>
}
