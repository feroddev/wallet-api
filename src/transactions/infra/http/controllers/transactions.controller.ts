import { Controller, Get, Query } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetTransactionsUseCase } from '../../../use-case/get-transactions.use-case'
import { GetTransactionsDto } from '../dto/get-transactions.dto'

@Auth()
@Controller('/transactions')
export class TransactionsController {
  constructor(private readonly getTransationsUseCase: GetTransactionsUseCase) {}

  @Get()
  async getTransactions(
    @Jwt() { userId }: JwtPayload,
    @Query() query: GetTransactionsDto
  ) {
    return this.getTransationsUseCase.execute(userId, query)
  }
}
