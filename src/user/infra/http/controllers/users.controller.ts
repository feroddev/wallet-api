import { Controller, Get } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetUserUseCase } from '../../../use-cases/get-user.use-case'

@Auth()
@Controller('/user')
export class UserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Get()
  async getUser(@Jwt() jwt: JwtPayload) {
    return this.getUserUseCase.execute(jwt.userId)
  }
}
