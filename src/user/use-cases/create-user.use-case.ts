import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '../infra/http/dto/create-user.dto'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserDto) {
    return this.userRepository.create(data)
  }
}
