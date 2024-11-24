import { Body, Controller, Get, Put } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetUserUseCase } from '../../../use-cases/get-user.use-case'
import { UpdateUserUseCase } from '../../../use-cases/update-user.use-case'
import { UpdateUserDto } from '../dto/update-user.dto'

@Auth()
@Controller('/user')
export class UserController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase
  ) {}

  @Get()
  async getUser(@Jwt() jwt: JwtPayload) {
    return this.getUserUseCase.execute(jwt.userId)
  }

  @Put()
  async updateUser(@Body() data: UpdateUserDto, @Jwt() jwt: JwtPayload) {
    return this.updateUserUseCase.execute(jwt.userId, data)
  }
}
