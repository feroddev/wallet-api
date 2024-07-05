import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CustomAuthGuard } from './guards/CustomAuthGuard';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: 'secret_word',
    signOptions: { expiresIn: '30d' },
  }),
  PassportModule
],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy, CustomAuthGuard]
})
export class AuthModule {}
