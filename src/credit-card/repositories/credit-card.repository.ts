import { CreditCard } from '@prisma/client'
import { CreateCreditCardDto } from '../infra/http/dto/create-credit-card.dto'

export abstract class CreditCardRepository {
  abstract create(
    userId: string,
    data: CreateCreditCardDto
  ): Promise<CreditCard>

  abstract find(data: Partial<CreditCard>): Promise<CreditCard>

  abstract findMany(data: Partial<CreditCard>): Promise<CreditCard[]>

  abstract update(id: string, data: Partial<CreditCard>): Promise<CreditCard>

  abstract delete(id: string): Promise<void>
}
