import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: 'secret_word',
    signOptions: { expiresIn: '30d' },
  })],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, PrismaService]
})
export class AuthModule {}
