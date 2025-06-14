import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { CreateCreditCardUseCase } from '../../../use-case/create-credit-card.use-case'
import { DeleteCreditCardUseCase } from '../../../use-case/delete-credit-card.use-case'
import { FindCreditCardUseCase } from '../../../use-case/find-credit-card.use-case'
import { GetCreditCardUseCase } from '../../../use-case/get-credit-card.use-case'
import { UpdateCreditCardUseCase } from '../../../use-case/update-credit-card.use-case'
import { CreateCreditCardDto } from '../dto/create-credit-card.dto'
import { UpdateCreditCardDto } from '../dto/update-credit-card.dto'

@Auth()
@ApiTags('Cartões de Crédito')
@Controller('/credit-cards')
export class CreditCardController {
  constructor(
    private readonly getCreditCardUseCase: GetCreditCardUseCase,
    private readonly createCreditCardUseCase: CreateCreditCardUseCase,
    private readonly deleteCreditCardUseCase: DeleteCreditCardUseCase,
    private readonly findCreditCardUseCase: FindCreditCardUseCase,
    private readonly updateCreditCardUseCase: UpdateCreditCardUseCase
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os cartões de crédito do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de cartões de crédito' })
  async getCreditCard(@Jwt() { userId }: JwtPayload) {
    return this.getCreditCardUseCase.execute(userId)
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo cartão de crédito' })
  @ApiBody({ type: CreateCreditCardDto })
  @ApiResponse({
    status: 201,
    description: 'Cartão de crédito criado com sucesso'
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createCreditCard(
    @Jwt() { userId }: JwtPayload,
    @Body() data: CreateCreditCardDto
  ) {
    return this.createCreditCardUseCase.execute(userId, data)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Buscar detalhes de um cartão de crédito' })
  @ApiParam({ name: 'id', description: 'ID do cartão de crédito' })
  @ApiResponse({ status: 200, description: 'Detalhes do cartão de crédito' })
  @ApiResponse({ status: 404, description: 'Cartão de crédito não encontrado' })
  async findCreditCard(
    @Jwt() { userId }: JwtPayload,
    @Param('id') creditCardId: string
  ) {
    return this.findCreditCardUseCase.execute(creditCardId, userId)
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualizar dados de um cartão de crédito' })
  @ApiParam({ name: 'id', description: 'ID do cartão de crédito' })
  @ApiBody({ type: UpdateCreditCardDto })
  @ApiResponse({
    status: 200,
    description: 'Cartão de crédito atualizado com sucesso'
  })
  @ApiResponse({ status: 404, description: 'Cartão de crédito não encontrado' })
  async updateCreditCard(
    @Jwt() { userId }: JwtPayload,
    @Body() data: UpdateCreditCardDto,
    @Param('id') creditCardId: string
  ) {
    return this.updateCreditCardUseCase.execute(userId, creditCardId, data)
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Excluir um cartão de crédito' })
  @ApiParam({ name: 'id', description: 'ID do cartão de crédito' })
  @ApiResponse({
    status: 200,
    description: 'Cartão de crédito excluído com sucesso'
  })
  @ApiResponse({ status: 404, description: 'Cartão de crédito não encontrado' })
  async deleteCreditCard(
    @Jwt() { userId }: JwtPayload,
    @Param('id') creditCardId: string
  ) {
    return this.deleteCreditCardUseCase.execute(userId, creditCardId)
  }
}
