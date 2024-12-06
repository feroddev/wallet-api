import { Injectable } from '@nestjs/common'
import { GetTransactionsDto } from '../infra/http/dto/get-transactions.dto'
import { TransactionRepository } from '../repositories/transaction.repository'

@Injectable()
export class GetTransactionsUseCase {
  constructor(private readonly transactionsRepository: TransactionRepository) {}
  async execute(userId: string, payload: GetTransactionsDto) {
    return this.transactionsRepository.findMany(userId, payload)
  }
}
