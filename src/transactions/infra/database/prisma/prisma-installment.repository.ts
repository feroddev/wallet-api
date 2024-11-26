import { Injectable } from '@nestjs/common'
import { Installment } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { InstallmentRepository } from '../../../repositories/installment.repository'
import { CreateInstallmentDto } from '../../http/dto/create-installment.dto'

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

  async findMany(data: Partial<Installment>): Promise<Installment[]> {
    return this.prisma.installment.findMany({
      where: data
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
