import { Injectable } from '@nestjs/common'
import { Invoice } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { InvoiceRepository } from '../../../repositories/invoice.repository'

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
      throw new Error('Cartão de crédito não encontrado')
    }

    const { closingDay, dueDay } = creditCard

    const closingDate = new Date(year, month - 1, closingDay)
    const dueDate = new Date(year, month - 1, dueDay)

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

  async markAsPaid(id: string): Promise<Invoice> {
    return this.prisma.invoice.update({
      where: { id },
      data: {
        isPaid: true,
        paidAt: new Date()
      }
    })
  }
}
