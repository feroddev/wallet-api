import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetInvoicesDto } from '../../../../credit-card/infra/http/dto/get-invoice.dto'
import { GetInvoicesUseCase } from '../../../use-case/get-invoices.use-case'
import { PayCreditCardUseCase } from '../../../use-case/pay-credit-card.use-case'
import { PayIncomeDto } from '../dto/pay-income.dto'

@Auth()
@ApiTags('Despesas de Cartão de Crédito')
@Controller('/credit-card-expense')
export class CreditCardExpenseController {
  constructor(
    private readonly payCreditCardUseCase: PayCreditCardUseCase,
    private readonly getInvoicesUseCase: GetInvoicesUseCase
  ) {}

  @Patch(':creditCardId/pay')
  @ApiOperation({ summary: 'Pagar fatura de cartão de crédito' })
  @ApiParam({ name: 'creditCardId', description: 'ID do cartão de crédito' })
  @ApiBody({ type: PayIncomeDto })
  @ApiResponse({ status: 200, description: 'Fatura paga com sucesso' })
  @ApiResponse({ status: 404, description: 'Cartão de crédito não encontrado' })
  async payCreditCard(
    @Param('creditCardId') creditCardId,
    @Jwt() { userId }: JwtPayload,
    @Body() { paidAt, dueDate }: PayIncomeDto
  ) {
    return this.payCreditCardUseCase.execute({
      creditCardId,
      userId,
      paidAt,
      dueDate
    })
  }

  @Get(':creditCardId')
  @ApiOperation({ summary: 'Listar faturas de um cartão de crédito' })
  @ApiParam({ name: 'creditCardId', description: 'ID do cartão de crédito' })
  @ApiQuery({ name: 'date', required: false, type: Date, description: 'Data de referência para buscar faturas' })
  @ApiResponse({ status: 200, description: 'Lista de faturas' })
  @ApiResponse({ status: 404, description: 'Cartão de crédito não encontrado' })
  async getInvoices(
    @Jwt() { userId }: JwtPayload,
    @Param('creditCardId') creditCardId: string,
    @Query() query: GetInvoicesDto
  ) {
    return this.getInvoicesUseCase.execute(userId, creditCardId, query)
  }
}
