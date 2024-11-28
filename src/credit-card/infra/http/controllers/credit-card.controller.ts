import { Body, Controller, Get, Post } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { CreateCreditCardUseCase } from '../../../use-case/create-credit-card.use-case'
import { GetCreditCardUseCase } from '../../../use-case/get-credit-card.use-case'
import { CreateCreditCardDto } from '../dto/create-credit-card.dto'

@Auth()
@Controller('/credit-card')
export class CreditCardController {
  constructor(
    private readonly getCreditCardUseCase: GetCreditCardUseCase,
    private readonly createCreditCardUseCase: CreateCreditCardUseCase
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
}
