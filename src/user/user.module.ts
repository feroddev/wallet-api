import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaUserRepository } from '../user/infra/database/prisma/prisma-user.repository'
import { UserController } from '../user/infra/http/controllers/users.controller'
import { UserRepository } from '../user/repositories/user.repository'

@Module({
  controllers: [UserController],
  imports: [],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository
    }
  ]
})
export class UserModule {}
