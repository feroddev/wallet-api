import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaUserRepository } from '../user/infra/database/prisma/prisma-user.repository'
import { UserRepository } from '../user/repositories/user.repository'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt/jwt.strategy'
import { JwtValidationUseCase } from './jwt/use-cases/jwt-validation.use-case'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtValidationUseCase,
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
