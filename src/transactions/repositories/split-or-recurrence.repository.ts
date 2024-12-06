import { Prisma } from '@prisma/client'
import { SplitOrRecurrenceDto } from '../infra/http/dto/create-split-or-recurrence.dto'

export abstract class SplitOrRecurrenceRepository {
  abstract createWithTransaction(
    data: SplitOrRecurrenceDto[],
    transaction: Prisma.TransactionClient
  ): Promise<any>
}
