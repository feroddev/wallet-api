import { Controller, Get } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'

@Auth()
@Controller('/user')
export class UserController {
  constructor() {}

  @Get()
  async getUser(@Jwt() jwt: JwtPayload) {
    console.log({ jwt })

    return 'User data'
  }
}
