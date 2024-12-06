import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { SplitOrRecurrenceRepository } from '../../../repositories/split-or-recurrence.repository'
import { SplitOrRecurrenceDto } from '../../http/dto/create-split-or-recurrence.dto'

@Injectable()
export class PrismaSplitOrRecurrenceRepository
  implements SplitOrRecurrenceRepository
{
  async createWithTransaction(
    data: SplitOrRecurrenceDto[],
    transaction: Prisma.TransactionClient
  ) {
    return transaction.splitOrRecurrence.createMany({
      data
    })
  }
}
