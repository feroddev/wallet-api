import { Injectable } from '@nestjs/common'
import { InvoiceRepository } from '../repositories/invoice.repository'

interface GetInvoicesRequest {
  userId: string
  month?: number
  year?: number
  creditCardId?: string
}

@Injectable()
export class GetInvoicesUseCase {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute(request: GetInvoicesRequest) {
    const { userId, month, year } = request

    const currentDate = new Date()
    const currentMonth = month || currentDate.getMonth() + 1
    const currentYear = year || currentDate.getFullYear()

    return this.invoiceRepository.findByUserIdAndMonth(
      userId,
      currentMonth,
      currentYear
    )
  }
}
