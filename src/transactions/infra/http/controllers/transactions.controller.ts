import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { CreateTransactionsUseCase } from '../../../use-case/create-transactions.use-case'
import { DeleteTransactionUseCase } from '../../../use-case/delete-transaction.use-case'
import { FindTransactionUseCase } from '../../../use-case/find-transaction.use-case'
import { GetTransactionsUseCase } from '../../../use-case/get-transactions.use-case'
import { UpdateTransactionUseCase } from '../../../use-case/update-transaction.use-case'
import { CreateTransactionDto } from '../dto/create-transaction.dto'
import { GetTransactionsDto } from '../dto/get-transactions.dto'
import { UpdateTransactionDto } from '../dto/update-transaction.dto'

@Auth()
@Controller('/transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionsUseCase: CreateTransactionsUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
    private readonly findTransactionUseCase: FindTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase
  ) {}

  @Post()
  async createTransaction(
    @Jwt() { userId }: JwtPayload,
    @Body() body: CreateTransactionDto
  ) {
    return this.createTransactionsUseCase.execute(userId, body)
  }

  @Get()
  async getTransactions(
    @Jwt() { userId }: JwtPayload,
    @Query() query: GetTransactionsDto
  ) {
    return this.getTransactionsUseCase.execute(userId, query)
  }

  @Get('/:id')
  async getTransaction(@Jwt() { userId }: JwtPayload, @Param('id') id: string) {
    return this.findTransactionUseCase.execute(id, userId)
  }

  @Patch('/:id')
  async updateTransaction(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string,
    @Body() body: UpdateTransactionDto
  ) {
    return this.updateTransactionUseCase.execute(id, userId, body)
  }

  @Delete('/:id')
  async deleteTransaction(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string
  ) {
    return this.deleteTransactionUseCase.execute(id, userId)
  }
}
