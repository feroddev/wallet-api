import { Injectable } from '@nestjs/common'
import { UpdateUserDto } from '../infra/http/dto/update-user.dto'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(id: string, data: UpdateUserDto) {
    await this.userRepository.update(id, data)
  }
}
