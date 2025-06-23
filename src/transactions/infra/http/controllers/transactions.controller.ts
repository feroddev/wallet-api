import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { CreateTransactionsUseCase } from '../../../use-case/create-transactions.use-case'
import { DeleteTransactionUseCase } from '../../../use-case/delete-transaction.use-case'
import { DeleteInstallmentsUseCase } from '../../../use-case/delete-installments.use-case'
import { FindTransactionUseCase } from '../../../use-case/find-transaction.use-case'
import { GetTransactionsUseCase } from '../../../use-case/get-transactions.use-case'
import { UpdateTransactionUseCase } from '../../../use-case/update-transaction.use-case'
import { PayTransactionUseCase } from '../../../use-case/pay-transaction.use-case'
import { CreateTransactionDto } from '../dto/create-transaction.dto'
import { GetTransactionsDto } from '../dto/get-transactions.dto'
import { UpdateTransactionDto } from '../dto/update-transaction.dto'
import { TransactionType } from '../dto/enum'

@Auth()
@ApiTags('Transações')
@Controller('/transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionsUseCase: CreateTransactionsUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
    private readonly findTransactionUseCase: FindTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
    private readonly deleteInstallmentsUseCase: DeleteInstallmentsUseCase,
    private readonly payTransactionUseCase: PayTransactionUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova transação' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, description: 'Transação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createTransaction(
    @Jwt() { userId }: JwtPayload,
    @Body() body: CreateTransactionDto
  ) {
    return this.createTransactionsUseCase.execute(userId, body)
  }

  @Get()
  @ApiOperation({ summary: 'Listar transações com filtros' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'type', required: false, enum: TransactionType })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiResponse({
    status: 200,
    description:
      'Lista de transações com total calculado (positivo para receitas, negativo para despesas e investimentos)'
  })
  async getTransactions(
    @Jwt() { userId }: JwtPayload,
    @Query() query: GetTransactionsDto
  ) {
    return this.getTransactionsUseCase.execute(userId, query)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Buscar uma transação pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da transação' })
  @ApiResponse({ status: 200, description: 'Transação encontrada' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async getTransaction(@Jwt() { userId }: JwtPayload, @Param('id') id: string) {
    return this.findTransactionUseCase.execute(id, userId)
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Atualizar uma transação' })
  @ApiParam({ name: 'id', description: 'ID da transação' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({ status: 200, description: 'Transação atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async updateTransaction(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string,
    @Body() body: UpdateTransactionDto
  ) {
    return this.updateTransactionUseCase.execute(id, userId, body)
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Excluir uma transação' })
  @ApiParam({ name: 'id', description: 'ID da transação' })
  @ApiResponse({ status: 200, description: 'Transação excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async deleteTransaction(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string
  ) {
    return this.deleteTransactionUseCase.execute(id, userId)
  }

  @Delete('/:id/installments')
  @ApiOperation({
    summary: 'Cancelar uma compra parcelada excluindo todas as parcelas'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de qualquer transação da compra parcelada'
  })
  @ApiResponse({
    status: 200,
    description: 'Compra parcelada cancelada com sucesso'
  })
  @ApiResponse({
    status: 404,
    description:
      'Transação não encontrada ou não é parte de uma compra parcelada'
  })
  async deleteInstallments(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string
  ) {
    return this.deleteInstallmentsUseCase.execute(userId, id)
  }

  @Patch('/:id/pay')
  @ApiOperation({ summary: 'Marcar uma transação como paga' })
  @ApiParam({ name: 'id', description: 'ID da transação' })
  @ApiResponse({ status: 200, description: 'Transação paga com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async payTransaction(@Jwt() { userId }: JwtPayload, @Param('id') id: string) {
    return this.payTransactionUseCase.execute(id, userId)
  }
}
