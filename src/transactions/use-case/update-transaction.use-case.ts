import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '../repositories/transaction.repository'
import { UpdateTransactionDto } from '../infra/http/dto/update-transaction.dto'

@Injectable()
export class UpdateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(id: string, userId: string, data: UpdateTransactionDto) {
    return this.transactionRepository.update(id, userId, data)
  }
}
