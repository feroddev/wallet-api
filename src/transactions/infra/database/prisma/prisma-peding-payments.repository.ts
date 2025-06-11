import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { errors } from '../../../../../constants/errors'
import { GetBillsDto } from '../../../../credit-card/infra/http/dto/get-bills.dto'
import { PrismaService } from '../../../../prisma/prisma.service'
import { PendingPaymentsRepository } from '../../../repositories/pending-payments.repository'
import { CreatePendingPaymentDto } from '../../http/dto/create-pending-payment.dto'
import { GetPendingPaymentsDto } from '../../http/dto/get-pending-payments.dto'
import { PayPendingPaymentDto } from '../../http/dto/pay-pending-payment.dto'
import { UpdatePendingPaymentDto } from '../../http/dto/update-pending-payment.dto'
import { PaymentStatus, TransactionType } from '../../http/dto/enum'

@Injectable()
export class PrismaPendingPaymentsRepository
  implements PendingPaymentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createWithTransaction(
    data: CreatePendingPaymentDto[],
    transaction: Prisma.TransactionClient
  ) {
    const formattedData = data.map(item => ({
      userId: item['userId'],
      name: item.name,
      description: item.description,
      categoryId: item.categoryId,
      totalAmount: item.totalAmount,
      dueDate: new Date(item.dueDate),
      status: item.paymentStatus || PaymentStatus.PENDING,
      paymentMethod: item.paymentMethod
    }))
    
    return transaction.pendingPayment.createMany({
      data: formattedData
    })
  }

  async create(userId: string, data: CreatePendingPaymentDto) {
    return this.prisma.pendingPayment.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        totalAmount: data.totalAmount,
        dueDate: new Date(data.dueDate),
        status: data.paymentStatus || PaymentStatus.PENDING,
        paymentMethod: data.paymentMethod
      }
    })
  }

  async findBills(userId: string, query: GetBillsDto) {
    const { date } = query
    const month = new Date(date).getUTCMonth()
    const year = new Date(date).getUTCFullYear()

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const installments = await this.prisma.pendingPayment.findMany({
      where: {
        userId,
        dueDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })

    const pending = installments.reduce((acc, curr) => {
      return (
        acc +
        Number(curr.totalAmount) *
          (curr.status === PaymentStatus.PENDING ? 1 : 0)
      )
    }, 0)

    const paid = installments.reduce((acc, curr) => {
      return (
        acc +
        Number(curr.totalAmount) * (curr.status === PaymentStatus.PAID ? 1 : 0)
      )
    }, 0)

    return {
      pending,
      paid,
      total: pending + paid,
      installments
    }
  }

  async findAll(userId: string, filters: GetPendingPaymentsDto) {
    const { status, startDate, endDate, categoryId } = filters
    
    const where: Prisma.PendingPaymentWhereInput = { userId }
    
    if (status) {
      where.status = status
    }
    
    if (startDate || endDate) {
      where.dueDate = {}
      
      if (startDate) {
        where.dueDate.gte = new Date(startDate)
      }
      
      if (endDate) {
        where.dueDate.lte = new Date(endDate)
      }
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    return this.prisma.pendingPayment.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
            type: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    })
  }
  
  async findById(id: string, userId: string) {
    const pendingPayment = await this.prisma.pendingPayment.findFirst({
      where: {
        id,
        userId
      },
      include: {
        category: {
          select: {
            name: true,
            type: true
          }
        }
      }
    })
    
    if (!pendingPayment) {
      throw new NotFoundException(errors.PENDING_PAYMENT_NOT_FOUND)
    }
    
    return pendingPayment
  }
  
  async update(id: string, userId: string, data: UpdatePendingPaymentDto) {
    const pendingPayment = await this.prisma.pendingPayment.findFirst({
      where: {
        id,
        userId
      }
    })
    
    if (!pendingPayment) {
      throw new NotFoundException(errors.PENDING_PAYMENT_NOT_FOUND)
    }
    
    return this.prisma.pendingPayment.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        totalAmount: data.totalAmount,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        status: data.paymentStatus,
        paymentMethod: data.paymentMethod
      }
    })
  }
  
  async delete(id: string, userId: string) {
    const pendingPayment = await this.prisma.pendingPayment.findFirst({
      where: {
        id,
        userId
      }
    })
    
    if (!pendingPayment) {
      throw new NotFoundException(errors.PENDING_PAYMENT_NOT_FOUND)
    }
    
    return this.prisma.pendingPayment.delete({
      where: { id }
    })
  }

  async payPendingPayment(id: string, userId: string, data: PayPendingPaymentDto): Promise<any> {
    const { paidAt, paymentMethod } = data
    const paidAtDate = new Date(paidAt)
    
    const pendingPayment = await this.prisma.pendingPayment.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!pendingPayment) {
      throw new NotFoundException(errors.PENDING_PAYMENT_NOT_FOUND)
    }
    
    return this.prisma.$transaction(async (prisma) => {
      const transaction = await prisma.transaction.create({
        data: {
          date: paidAtDate,
          name: pendingPayment.name,
          paymentMethod,
          totalAmount: pendingPayment.totalAmount,
          type: TransactionType.EXPENSE,
          categoryId: pendingPayment.categoryId,
          description: pendingPayment.description,
          userId,
          isPaid: true
        }
      })
      
      await prisma.pendingPayment.update({
        where: { id },
        data: {
          status: PaymentStatus.PAID,
          paidAt: paidAtDate,
          paymentMethod,
          transactionId: transaction.id
        }
      })
      
      return { message: 'Pagamento realizado com sucesso', transaction }
    })
  }
}
