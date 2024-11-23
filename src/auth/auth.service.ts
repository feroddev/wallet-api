import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { errors } from 'constants/errors'
import { UserRepository } from '../user/repositories/user.repository'
import { LoginDto } from './dtos/login.dto'
import { JwtPayload } from './jwt/interfaces/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.userRepository.findWithPassword(email)

    if (!user) {
      throw new NotFoundException(errors.USER_NOT_FOUND)
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      throw new BadRequestException(errors.INVALID_PASSWORD)
    }

    const token = this.jwtService.sign({
      userId: user.id,
      user: {
        email: user.email,
        plan: user.plan,
        name: user.name
      }
    } as JwtPayload)

    return { token }
  }
}
