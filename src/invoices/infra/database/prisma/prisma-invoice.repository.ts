import { Injectable, NotFoundException } from '@nestjs/common'
import { Invoice, PaymentMethod, Prisma } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { InvoiceRepository } from '../../../repositories/invoice.repository'
import { errors } from '../../../../../constants/errors'
import { DateUtils } from '../../../../utils/date.utils'

@Injectable()
export class PrismaInvoiceRepository implements InvoiceRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Partial<Invoice>): Promise<Invoice> {
    return this.prisma.invoice.create({
      data: data as any
    })
  }

  async findById(id: string): Promise<Invoice | null> {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: {
        creditCard: true,
        transactions: true
      }
    })
  }

  async getInvoicesWithTransactions(
    userId: string
  ): Promise<{ paid: Invoice[]; pending: Invoice[] }> {
    const paid = await this.prisma.invoice.findMany({
      where: {
        userId,
        isPaid: true,
        totalAmount: {
          gt: 0
        }
      },
      include: {
        creditCard: true,
        transactions: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        paidAt: 'desc'
      }
    })

    const pending = await this.prisma.invoice.findMany({
      where: {
        userId,
        isPaid: false,
        totalAmount: {
          gt: 0
        }
      },
      include: {
        creditCard: true,
        transactions: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    })

    return { paid, pending }
  }

  async findByUserIdAndMonth(
    userId: string,
    month: number,
    year: number
  ): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      where: {
        userId,
        month,
        year
      },
      include: {
        creditCard: true,
        transactions: {
          include: {
            category: true
          }
        }
      }
    })
  }

  async findByCreditCardIdAndMonth(
    creditCardId: string,
    month: number,
    year: number
  ): Promise<Invoice | null> {
    return this.prisma.invoice.findFirst({
      where: {
        creditCardId,
        month,
        year
      },
      include: {
        transactions: {
          include: {
            category: true
          }
        }
      }
    })
  }

  async findPendingByCreditCardId(creditCardId: string): Promise<Invoice[]> {
    const currentDate = new Date()

    return this.prisma.invoice.findMany({
      where: {
        creditCardId,
        isPaid: false,
        dueDate: {
          gte: currentDate
        }
      }
    })
  }

  async update(id: string, data: Partial<Invoice>): Promise<Invoice> {
    return this.prisma.invoice.update({
      where: { id },
      data
    })
  }

  async generateInvoice(
    creditCardId: string,
    month: number,
    year: number
  ): Promise<Invoice> {
    const creditCard = await this.prisma.creditCard.findUnique({
      where: { id: creditCardId }
    })

    if (!creditCard) {
      throw new NotFoundException(errors.CREDIT_CARD_NOT_FOUND)
    }

    const { closingDay, dueDay } = creditCard

    // Criamos as datas preservando o fuso horário local usando o utilitário de datas
    const closingDate = DateUtils.createLocalDate(year, month - 1, closingDay)
    const dueDate = DateUtils.createLocalDate(year, month - 1, dueDay)

    if (dueDay < closingDay) {
      dueDate.setMonth(dueDate.getMonth() + 1)
    }

    const existingInvoice = await this.findByCreditCardIdAndMonth(
      creditCardId,
      month,
      year
    )

    if (existingInvoice) {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          creditCardId,
          date: {
            lt: closingDate
          },
          invoiceId: null
        }
      })

      const totalAmount = transactions.reduce(
        (acc, transaction) => acc + Number(transaction.totalAmount),
        0
      )

      await this.prisma.$transaction(
        transactions.map((transaction) =>
          this.prisma.transaction.update({
            where: { id: transaction.id },
            data: { invoiceId: existingInvoice.id }
          })
        )
      )

      return this.prisma.invoice.update({
        where: { id: existingInvoice.id },
        data: {
          totalAmount: {
            increment: totalAmount
          }
        },
        include: {
          transactions: true
        }
      })
    }

    const previousMonthClosingDate = new Date(closingDate)
    previousMonthClosingDate.setMonth(previousMonthClosingDate.getMonth() - 1)

    const currentMonthClosingDate = closingDate

    const transactions = await this.prisma.transaction.findMany({
      where: {
        creditCardId,
        date: {
          gte: previousMonthClosingDate,
          lt: currentMonthClosingDate
        },
        invoiceId: null
      }
    })

    const totalAmount = transactions.reduce(
      (acc, transaction) => acc + Number(transaction.totalAmount),
      0
    )

    const invoice = await this.prisma.invoice.create({
      data: {
        userId: creditCard.userId,
        creditCardId,
        month,
        year,
        totalAmount,
        closingDate,
        dueDate
      }
    })

    if (transactions.length > 0) {
      await this.prisma.$transaction(
        transactions.map((transaction) =>
          this.prisma.transaction.update({
            where: { id: transaction.id },
            data: { invoiceId: invoice.id }
          })
        )
      )
    }

    return this.findById(invoice.id)
  }

  async markAsPaid(
    id: string,
    paymentMethod: PaymentMethod,
    paidAt: Date
  ): Promise<Invoice> {
    return this.prisma.$transaction(async (prisma) => {
      return this._markAsPaid(id, paymentMethod, paidAt, prisma)
    })
  }

  async markAsPaidWithTransaction(
    id: string,
    paymentMethod: PaymentMethod,
    paidAt: Date,
    transaction: Prisma.TransactionClient
  ): Promise<Invoice> {
    return this._markAsPaid(id, paymentMethod, paidAt, transaction)
  }

  private async _markAsPaid(
    id: string,
    paymentMethod: PaymentMethod,
    paidAt: Date,
    prisma: Prisma.TransactionClient
  ): Promise<Invoice> {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        isPaid: true,
        paidAt
      },
      include: {
        transactions: true
      }
    })

    if (invoice.transactions.length > 0) {
      await Promise.all(
        invoice.transactions.map((transaction) =>
          prisma.transaction.update({
            where: { id: transaction.id },
            data: { isPaid: true }
          })
        )
      )
    }

    const faturaCategory = await prisma.category.findFirst({
      where: {
        name: 'Fatura do Cartão',
        type: 'EXPENSE'
      }
    })

    if (!faturaCategory) {
      throw new NotFoundException(errors.CATEGORY_NOT_FOUND)
    }

    const creditCard = await prisma.creditCard.findUnique({
      where: { id: invoice.creditCardId }
    })

    if (!creditCard) {
      throw new NotFoundException(errors.CREDIT_CARD_NOT_FOUND)
    }

    await prisma.transaction.create({
      data: {
        userId: invoice.userId,
        name: `Pagamento de fatura do cartão ${creditCard.cardName}`,
        description: `Pagamento do mês ${invoice.month}/${invoice.year}`,
        type: 'EXPENSE',
        paymentMethod,
        date: paidAt,
        totalAmount: invoice.totalAmount,
        isPaid: true,
        categoryId: faturaCategory.id,
        creditCardId: creditCard.id
      }
    })

    return invoice
  }
}
