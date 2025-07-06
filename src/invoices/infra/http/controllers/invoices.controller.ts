import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
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
import { GenerateInvoiceUseCase } from '../../../use-case/generate-invoice.use-case'
import { GetInvoicesUseCase } from '../../../use-case/get-invoices.use-case'
import { PayInvoiceUseCase } from '../../../use-case/pay-invoice.use-case'
import { GenerateInvoiceDto } from '../dto/generate-invoice.dto'
import { PayInvoiceDto } from '../dto/pay-invoice.dto'
import { PaymentMethod } from '@prisma/client'
import { DateUtils } from '../../../../utils/date.utils'

@Auth()
@ApiTags('Faturas')
@Controller('invoices')
export class InvoicesController {
  constructor(
    private generateInvoiceUseCase: GenerateInvoiceUseCase,
    private getInvoicesUseCase: GetInvoicesUseCase,
    private payInvoiceUseCase: PayInvoiceUseCase
  ) {}

  @Post('generate')
  @ApiOperation({ summary: 'Gerar fatura de cartão de crédito' })
  @ApiBody({ type: GenerateInvoiceDto })
  @ApiResponse({ status: 201, description: 'Fatura gerada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Cartão de crédito não encontrado' })
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

    return invoice
  }

  @Get()
  @ApiOperation({ summary: 'Listar faturas de cartões de crédito' })
  @ApiResponse({ status: 200, description: 'Lista de faturas' })
  async getInvoices(@Jwt() { userId }: JwtPayload) {
    const invoices = await this.getInvoicesUseCase.execute({
      userId
    })

    return invoices
  }

  @Patch(':id/pay')
  @ApiOperation({ summary: 'Pagar fatura de cartão de crédito' })
  @ApiParam({ name: 'id', description: 'ID da fatura' })
  @ApiResponse({ status: 200, description: 'Fatura paga com sucesso' })
  async payInvoice(
    @Param('id') id: string,
    @Body() payInvoiceDto: PayInvoiceDto,
    @Jwt() { userId }: JwtPayload
  ) {
    const invoice = await this.payInvoiceUseCase.execute({
      id,
      userId,
      paymentMethod: payInvoiceDto.paymentMethod || PaymentMethod.CASH,
      paidAt: DateUtils.fromDate(new Date())
    })

    return invoice
  }
}
