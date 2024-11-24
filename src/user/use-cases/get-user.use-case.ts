import { Injectable, NotFoundException } from '@nestjs/common'
import { errors } from '../../../constants/errors'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(id: string) {
    const user = this.userRepository.find({ id })

    if (!user) {
      throw new NotFoundException(errors.USER_NOT_FOUND)
    }

    return user
  }
}
