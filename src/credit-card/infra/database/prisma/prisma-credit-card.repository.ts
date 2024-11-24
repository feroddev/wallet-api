import { CreditCard } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { CreditCardRepository } from '../../../repositories/credit-card.repository'

export class PrismaCreditCardRepository implements CreditCardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreditCard): Promise<CreditCard> {
    return this.prisma.creditCard.create({
      data
    })
  }

  async find(data: Partial<CreditCard>): Promise<CreditCard> {
    return this.prisma.creditCard.findFirst({
      where: data
    })
  }

  async findMany(data: Partial<CreditCard>): Promise<CreditCard[]> {
    return this.prisma.creditCard.findMany({
      where: data
    })
  }

  async update(id: string, data: Partial<CreditCard>): Promise<CreditCard> {
    return this.prisma.creditCard.update({
      where: { id },
      data
    })
  }

  async delete(id: string) {
    await this.prisma.creditCard.delete({
      where: {
        id
      }
    })
  }
}
