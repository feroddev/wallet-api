import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '../infra/http/dto/create-user.dto'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserDto) {
    const password = bcrypt.hashSync(
      data.password,
      Number(process.env.SALT_ROUNDS)
    )

    return this.userRepository.create({ ...data, password })
  }
}
