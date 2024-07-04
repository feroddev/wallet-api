import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SignInModule } from './sign-in/sign-in.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [PrismaModule, SignInModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
