import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CreditCardModule } from './credit-card/credit-card.module'
import { InvoicesModule } from './invoices/invoices.module'
import { PrismaModule } from './prisma/prisma.module'
import { TransactionsModule } from './transactions/transactions.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    TransactionsModule,
    CreditCardModule,
    InvoicesModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
