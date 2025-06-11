import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetBillsDto } from '../../../../credit-card/infra/http/dto/get-bills.dto'
import { CreatePendingPaymentUseCase } from '../../../use-case/create-pending-payment.use-case'
import { DeletePendingPaymentUseCase } from '../../../use-case/delete-pending-payment.use-case'
import { FindPendingPaymentUseCase } from '../../../use-case/find-pending-payment.use-case'
import { GetBillsUseCase } from '../../../use-case/get-bills.use-case'
import { GetPendingPaymentsUseCase } from '../../../use-case/get-pending-payments.use-case'
import { PayPendingPaymentUseCase } from '../../../use-case/pay-pending-payment.use-case'
import { UpdatePendingPaymentUseCase } from '../../../use-case/update-pending-payment.use-case'
import { CreatePendingPaymentDto } from '../dto/create-pending-payment.dto'
import { GetPendingPaymentsDto } from '../dto/get-pending-payments.dto'
import { PayPendingPaymentDto } from '../dto/pay-pending-payment.dto'
import { UpdatePendingPaymentDto } from '../dto/update-pending-payment.dto'

@Auth()
@ApiTags('Pagamentos Pendentes')
@Controller('/pending-payment')
export class PendingPaymentController {
  constructor(
    private readonly createPendingPaymentUseCase: CreatePendingPaymentUseCase,
    private readonly getPendingPaymentsUseCase: GetPendingPaymentsUseCase,
    private readonly findPendingPaymentUseCase: FindPendingPaymentUseCase,
    private readonly updatePendingPaymentUseCase: UpdatePendingPaymentUseCase,
    private readonly deletePendingPaymentUseCase: DeletePendingPaymentUseCase,
    private readonly payPendingPaymentUseCase: PayPendingPaymentUseCase,
    private readonly getBillsUseCase: GetBillsUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo pagamento pendente' })
  @ApiBody({ type: CreatePendingPaymentDto })
  @ApiResponse({ status: 201, description: 'Pagamento pendente criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(
    @Jwt() { userId }: JwtPayload,
    @Body() data: CreatePendingPaymentDto
  ) {
    return this.createPendingPaymentUseCase.execute(userId, data)
  }

  @Get()
  @ApiOperation({ summary: 'Listar pagamentos pendentes com filtros' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'PAID'] })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiResponse({ status: 200, description: 'Lista de pagamentos pendentes' })
  async getAll(
    @Jwt() { userId }: JwtPayload,
    @Query() filters: GetPendingPaymentsDto
  ) {
    return this.getPendingPaymentsUseCase.execute(userId, filters)
  }

  @Get('/bills')
  @ApiOperation({ summary: 'Listar contas a pagar agrupadas por mês' })
  @ApiQuery({ name: 'date', required: true, type: Date })
  @ApiResponse({ status: 200, description: 'Lista de contas a pagar' })
  async getBills(@Jwt() { userId }: JwtPayload, @Query() query: GetBillsDto) {
    return this.getBillsUseCase.execute(userId, query)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Buscar um pagamento pendente pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pagamento pendente' })
  @ApiResponse({ status: 200, description: 'Pagamento pendente encontrado' })
  @ApiResponse({ status: 404, description: 'Pagamento pendente não encontrado' })
  async getById(@Jwt() { userId }: JwtPayload, @Param('id') id: string) {
    return this.findPendingPaymentUseCase.execute(id, userId)
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Atualizar um pagamento pendente' })
  @ApiParam({ name: 'id', description: 'ID do pagamento pendente' })
  @ApiBody({ type: UpdatePendingPaymentDto })
  @ApiResponse({ status: 200, description: 'Pagamento pendente atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pagamento pendente não encontrado' })
  async update(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string,
    @Body() data: UpdatePendingPaymentDto
  ) {
    return this.updatePendingPaymentUseCase.execute(id, userId, data)
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Excluir um pagamento pendente' })
  @ApiParam({ name: 'id', description: 'ID do pagamento pendente' })
  @ApiResponse({ status: 200, description: 'Pagamento pendente excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Pagamento pendente não encontrado' })
  async delete(@Jwt() { userId }: JwtPayload, @Param('id') id: string) {
    return this.deletePendingPaymentUseCase.execute(id, userId)
  }

  @Post('/:id/pay')
  @ApiOperation({ summary: 'Marcar um pagamento pendente como pago' })
  @ApiParam({ name: 'id', description: 'ID do pagamento pendente' })
  @ApiBody({ type: PayPendingPaymentDto })
  @ApiResponse({ status: 200, description: 'Pagamento realizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pagamento pendente não encontrado' })
  async pay(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string,
    @Body() data: PayPendingPaymentDto
  ) {
    return this.payPendingPaymentUseCase.execute(id, userId, data)
  }
}
