import { Injectable } from '@nestjs/common'
import { InvoiceRepository } from '../repositories/invoice.repository'

interface GetInvoicesRequest {
  userId: string
}

@Injectable()
export class GetInvoicesUseCase {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute(request: GetInvoicesRequest) {
    const { userId } = request

    return this.invoiceRepository.getInvoicesWithTransactions(userId)
  }
}
