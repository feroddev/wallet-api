import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { CreateCreditCardUseCase } from '../../../use-case/create-credit-card.use-case'
import { GetCreditCardUseCase } from '../../../use-case/get-credit-card.use-case'
import { GetInvoicesUseCase } from '../../../use-case/get-invoices.use-case'
import { CreateCreditCardDto } from '../dto/create-credit-card.dto'
import { GetInvoicesDto } from '../dto/get-invoice.dto'

@Auth()
@Controller('/credit-card')
export class CreditCardController {
  constructor(
    private readonly getCreditCardUseCase: GetCreditCardUseCase,
    private readonly createCreditCardUseCase: CreateCreditCardUseCase,
    private readonly getInvoiceUseCase: GetInvoicesUseCase
  ) {}

  @Get()
  async getCreditCard(@Jwt() { userId }: JwtPayload) {
    return this.getCreditCardUseCase.execute(userId)
  }

  @Post()
  async createCreditCard(
    @Jwt() { userId }: JwtPayload,
    @Body() data: CreateCreditCardDto
  ) {
    return this.createCreditCardUseCase.execute(userId, data)
  }

  @Get('/:creditCardId/invoices')
  async getInvoices(
    @Jwt() { userId }: JwtPayload,
    @Param('creditCardId') creditCardId: string,
    @Query() query: GetInvoicesDto
  ) {
    return this.getInvoiceUseCase.execute(userId, creditCardId, query)
  }
}
