import { PrismaService } from '@app/prisma/prisma.service'
import { UserRepository } from '@app/user/repositories/user.repository'
import { User } from '@prisma/client'

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: User): Promise<Omit<User, 'password'>> {
    const result = await this.prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        plan: true,
        subscriptionExpiration: true
      }
    })

    return result
  }

  async findWithPassword(email: string): Promise<User> {
    const result = await this.prisma.user.findFirst({
      where: {
        email
      }
    })

    return result
  }

  async find(data: Partial<User>): Promise<Omit<User, 'password'>> {
    const result = await this.prisma.user.findFirst({
      where: data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        plan: true,
        subscriptionExpiration: true
      }
    })

    return result
  }

  async findMany(data: Partial<User>): Promise<Omit<User, 'password'>[]> {
    const result = await this.prisma.user.findMany({
      where: data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        plan: true,
        subscriptionExpiration: true
      }
    })

    return result
  }

  async update(
    id: string,
    data: Partial<User>
  ): Promise<Omit<User, 'password'>> {
    const result = await this.prisma.user.update({
      where: {
        id
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        plan: true,
        subscriptionExpiration: true
      }
    })

    return result
  }

  async delete(id: string) {
    await this.prisma.user.delete({
      where: {
        id
      }
    })
  }
}
