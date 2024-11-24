import { CreditCard } from '@prisma/client'

export abstract class CreditCardRepository {
  abstract create(data: CreditCard): Promise<CreditCard>

  abstract find(data: Partial<CreditCard>): Promise<CreditCard>

  abstract findMany(data: Partial<CreditCard>): Promise<CreditCard[]>

  abstract update(id: string, data: Partial<CreditCard>): Promise<CreditCard>

  abstract delete(id: string): Promise<void>
}
