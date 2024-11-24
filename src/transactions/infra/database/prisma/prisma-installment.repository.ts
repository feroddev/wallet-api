import { Installment } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { InstallmentRepository } from '../../../repositories/installment.repository'

export class PrismaInstallmentRepository implements InstallmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Installment): Promise<Installment> {
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
}
