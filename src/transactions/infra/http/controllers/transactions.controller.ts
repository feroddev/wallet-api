import { Body, Controller, Post } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { CreateTransactionsUseCase } from '../../../use-case/create-transactions.use-case'
import { CreateTransactionDto } from '../dto/create-transaction.dto'

@Auth()
@Controller('/transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionsUseCase: CreateTransactionsUseCase
  ) {}

  @Post()
  async createTransaction(
    @Jwt() { userId }: JwtPayload,
    @Body() body: CreateTransactionDto
  ) {
    return this.createTransactionsUseCase.execute(userId, body)
  }
}
