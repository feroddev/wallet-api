import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaUserRepository } from '../user/infra/database/prisma/prisma-user.repository'
import { UserRepository } from '../user/repositories/user.repository'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository
    }
  ],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET
    })
  ],
  exports: [JwtModule]
})
export class AuthModule {}
