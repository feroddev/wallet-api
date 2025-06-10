import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { CreateRecurringTransactionsUseCase } from '../../use-case/create-recurring-transactions.use-case'

@Injectable()
export class RecurringTransactionsCron {
  constructor(
    private readonly createRecurringTransactionsUseCase: CreateRecurringTransactionsUseCase
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleRecurringTransactions() {
    await this.createRecurringTransactionsUseCase.execute()
  }
}
