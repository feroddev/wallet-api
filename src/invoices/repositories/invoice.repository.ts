import { Invoice, PaymentMethod } from '@prisma/client'

export abstract class InvoiceRepository {
  abstract create(data: Partial<Invoice>): Promise<Invoice>

  abstract findById(id: string): Promise<Invoice | null>

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

  abstract update(id: string, data: Partial<Invoice>): Promise<Invoice>

  abstract generateInvoice(
    creditCardId: string,
    month: number,
    year: number
  ): Promise<Invoice>

  abstract markAsPaid(id: string, paymentMethod: PaymentMethod, paidAt: Date): Promise<Invoice>
}
