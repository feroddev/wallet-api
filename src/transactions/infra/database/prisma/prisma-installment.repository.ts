import { BadRequestException, Injectable } from '@nestjs/common'
import { Installment } from '@prisma/client'
import { errors } from 'constants/errors'
import { PrismaService } from '../../../../prisma/prisma.service'
import { InstallmentRepository } from '../../../repositories/installment.repository'
import { CreateInstallmentDto } from '../../http/dto/create-installment.dto'
import { GetInstallmentsDto } from '../../http/dto/get-installments.dto'

@Injectable()
export class PrismaInstallmentRepository implements InstallmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateInstallmentDto): Promise<Installment> {
    return this.prisma.installment.create({
      data
    })
  }

  async find(data: Partial<Installment>): Promise<Installment> {
    return this.prisma.installment.findFirst({
      where: data
    })
  }

  async findMany(
    userId: string,
    data: GetInstallmentsDto
  ): Promise<Installment[]> {
    const { creditCardId, fromDueDate, paymentStatus, toDueDate } = data

    if (fromDueDate && toDueDate && fromDueDate > toDueDate) {
      throw new BadRequestException(errors.INVALID_FROM_DATE_AFTER_TO_DATE)
    }

    return this.prisma.installment.findMany({
      where: {
        transaction: {
          isInstallment: true,
          userId,
          ...(creditCardId ? { creditCardId } : {})
        },
        ...(fromDueDate ? { dueDate: { gte: fromDueDate } } : {}),
        ...(toDueDate ? { dueDate: { lte: toDueDate } } : {}),
        ...(paymentStatus
          ? {
              paymentStatus: {
                equals: paymentStatus
              }
            }
          : {})
      },
      include: {
        transaction: true
      }
    })
  }

  async update(id: string, data: Partial<Installment>): Promise<Installment> {
    return this.prisma.installment.update({
      where: { id },
      data
    })
  }

  async delete(id: string) {
    await this.prisma.installment.delete({
      where: {
        id
      }
    })
  }

  async createMany(data: CreateInstallmentDto[]): Promise<Installment[]> {
    const createdInstallments = await Promise.all(
      data.map((installment) =>
        this.prisma.installment.create({
          data: installment
        })
      )
    )

    return createdInstallments
  }
}
