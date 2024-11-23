import { Controller } from '@nestjs/common'
import { CreateUserUseCase } from '../../../../user/use-cases/create-user.use-case'

@Controller('/user')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}
}
