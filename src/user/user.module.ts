import { PrismaService } from '@app/prisma/prisma.service';
import { UserController } from '@app/user/infra/http/controllers/users.controller';
import { Module } from '@nestjs/common';
import { PrismaUserRepository } from '@user/infra/database/prisma/prisma-user.repository';
import { UserRepository } from '@user/repositories/user.repository';

@Module({
  controllers: [UserController],
  imports: [],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
