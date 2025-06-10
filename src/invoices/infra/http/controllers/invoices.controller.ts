import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GenerateInvoiceUseCase } from '../../../use-case/generate-invoice.use-case'
import { GetInvoicesUseCase } from '../../../use-case/get-invoices.use-case'
import { PayInvoiceUseCase } from '../../../use-case/pay-invoice.use-case'
import { GenerateInvoiceDto } from '../dto/generate-invoice.dto'
import { GetInvoicesDto } from '../dto/get-invoices.dto'

@Auth()
@Controller('invoices')
export class InvoicesController {
  constructor(
    private generateInvoiceUseCase: GenerateInvoiceUseCase,
    private getInvoicesUseCase: GetInvoicesUseCase,
    private payInvoiceUseCase: PayInvoiceUseCase
  ) {}

  @Post('generate')
  async generate(
    @Body() body: GenerateInvoiceDto,
    @Jwt() { userId }: JwtPayload
  ) {
    const { creditCardId, month, year } = body

    const invoice = await this.generateInvoiceUseCase.execute({
      creditCardId,
      month,
      year,
      userId
    })

    return {
      invoice
    }
  }

  @Get()
  async getInvoices(
    @Query() query: GetInvoicesDto,
    @Jwt() { userId }: JwtPayload
  ) {
    const { month, year, creditCardId } = query

    const invoices = await this.getInvoicesUseCase.execute({
      userId,
      month,
      year,
      creditCardId
    })

    return {
      invoices
    }
  }

  @Patch(':id/pay')
  async payInvoice(
    @Param('id') id: string,
    @Jwt() { userId }: JwtPayload
  ) {
    const invoice = await this.payInvoiceUseCase.execute({
      id,
      userId
    })

    return {
      invoice
    }
  }
}
