import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
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
@Controller('/credit-card')
export class CreditCardController {
  constructor(
    private readonly getCreditCardUseCase: GetCreditCardUseCase,
    private readonly createCreditCardUseCase: CreateCreditCardUseCase,
    private readonly deleteCreditCardUseCase: DeleteCreditCardUseCase,
    private readonly findCreditCardUseCase: FindCreditCardUseCase,
    private readonly updateCreditCardUseCase: UpdateCreditCardUseCase
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

  @Get('/:creditCardId')
  async findCreditCard(
    @Jwt() { userId }: JwtPayload,
    @Param('creditCardId') creditCardId: string
  ) {
    return this.findCreditCardUseCase.execute(creditCardId, userId)
  }

  @Put('/:creditCardId')
  async updateCreditCard(
    @Jwt() { userId }: JwtPayload,
    @Body() data: UpdateCreditCardDto,
    @Param('creditCardId') creditCardId: string
  ) {
    return this.updateCreditCardUseCase.execute(userId, creditCardId, data)
  }

  @Delete('/:creditCardId')
  async deleteCreditCard(
    @Jwt() { userId }: JwtPayload,
    @Param('creditCardId') creditCardId: string
  ) {
    return this.deleteCreditCardUseCase.execute(userId, creditCardId)
  }
}
