import { Body, Controller, Post } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { CreateUserUseCase } from '../../../../user/use-cases/create-user.use-case'
import { CreateUserDto } from '../dto/create-user.dto'

@Auth()
@Controller('/user')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.createUserUseCase.execute(data)
  }
}
