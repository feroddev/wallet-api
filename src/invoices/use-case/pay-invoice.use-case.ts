import { Injectable } from '@nestjs/common'
import { PaymentMethod } from '@prisma/client'
import { InvoiceRepository } from '../repositories/invoice.repository'

interface PayInvoiceRequest {
  id: string
  userId: string
  paymentMethod: PaymentMethod
  paidAt: Date
}

@Injectable()
export class PayInvoiceUseCase {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute(request: PayInvoiceRequest) {
    const { id, paymentMethod, paidAt } = request
    
    const invoice = await this.invoiceRepository.findById(id)
    
    if (!invoice) {
      throw new Error('Fatura não encontrada')
    }
    
    return this.invoiceRepository.markAsPaid(id, paymentMethod, paidAt)
  }
}
