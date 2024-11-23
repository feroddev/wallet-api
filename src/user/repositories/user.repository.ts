import { User } from '@prisma/client'
import { CreateUserDto } from '../infra/http/dto/create-user.dto'

export abstract class UserRepository {
  abstract create(data: CreateUserDto): Promise<Omit<User, 'password'>>

  abstract findWithPassword(email: string): Promise<User>

  abstract find(data: Partial<User>): Promise<Omit<User, 'password'>>

  abstract findMany(data: Partial<User>): Promise<Omit<User, 'password'>[]>

  abstract update(
    id: string,
    data: Partial<User>
  ): Promise<Omit<User, 'password'>>

  abstract delete(id: string): Promise<void>
}
