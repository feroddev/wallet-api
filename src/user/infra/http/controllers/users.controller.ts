import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserUseCase } from '../../../../user/use-cases/create-user.use-case'
import { CreateUserDto } from '../dto/create-user.dto'

@Controller('/user')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.createUserUseCase.execute(data)
  }
}
