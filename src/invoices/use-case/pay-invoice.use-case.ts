import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { PaymentMethod, Prisma } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { InvoiceRepository } from '../repositories/invoice.repository'
import { errors } from '../../../constants/errors'
import { DateUtils } from '../../utils/date.utils'

interface PayInvoiceRequest {
  id: string
  userId: string
  paymentMethod: PaymentMethod
  paidAt?: Date
}

@Injectable()
export class PayInvoiceUseCase {
  constructor(
    private invoiceRepository: InvoiceRepository,
    private prisma: PrismaService
  ) {}

  async execute(request: PayInvoiceRequest) {
    const { id, userId, paymentMethod, paidAt = DateUtils.fromDate(new Date()) } = request

    const invoice = await this.invoiceRepository.findById(id)

    if (!invoice) {
      throw new NotFoundException(errors.INVOICE_NOT_FOUND)
    }

    if (invoice.userId !== userId) {
      throw new NotFoundException(errors.INVOICE_NOT_FOUND)
    }

    if (invoice.isPaid) {
      return {
        message: 'Fatura já está paga',
        invoice
      }
    }

    // Verificar se a fatura já foi fechada
    const currentDate = DateUtils.fromDate(new Date())
    if (currentDate < invoice.closingDate) {
      throw new BadRequestException(
        errors.CANNOT_PAY_INVOICE_BEFORE_CLOSING_DATE
      )
    }

    return this.prisma.$transaction(async (transaction) => {
      // Marca a fatura como paga
      const paidInvoice =
        await this.invoiceRepository.markAsPaidWithTransaction(
          id,
          paymentMethod,
          paidAt,
          transaction
        )

      // Marca todas as transações da fatura como pagas
      await transaction.transaction.updateMany({
        where: {
          invoiceId: id,
          userId: userId,
          isPaid: false
        },
        data: {
          isPaid: true
        }
      })

      return {
        message: 'Fatura paga com sucesso',
        invoice: paidInvoice
      }
    })
  }
}
