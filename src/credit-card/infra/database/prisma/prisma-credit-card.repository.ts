import { Injectable } from '@nestjs/common'
import { CreditCard } from '@prisma/client'
import { PrismaService } from '../../../../prisma/prisma.service'
import { CreditCardRepository } from '../../../repositories/credit-card.repository'
import { CreateCreditCardDto } from '../../http/dto/create-credit-card.dto'
import { UpdateCreditCardDto } from '../../http/dto/update-credit-card.dto'
@Injectable()
export class PrismaCreditCardRepository implements CreditCardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateCreditCardDto): Promise<CreditCard> {
    return this.prisma.creditCard.create({
      data: {
        ...data,
        userId
      }
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

  async update(id: string, data: UpdateCreditCardDto): Promise<CreditCard> {
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
