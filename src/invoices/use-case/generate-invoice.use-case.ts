import { Injectable } from '@nestjs/common'
import { InvoiceRepository } from '../repositories/invoice.repository'

interface GenerateInvoiceRequest {
  creditCardId: string
  month: number
  year: number
  userId: string
}

@Injectable()
export class GenerateInvoiceUseCase {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute(request: GenerateInvoiceRequest) {
    const { creditCardId, month, year } = request

    return this.invoiceRepository.generateInvoice(creditCardId, month, year)
  }
}
