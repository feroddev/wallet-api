import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaCreditCardRepository } from './infra/database/prisma/prisma-credit-card.repository'
import { CreditCardController } from './infra/http/controllers/credit-card.controller'
import { CreditCardRepository } from './repositories/credit-card.repository'
import { CreateCreditCardUseCase } from './use-case/create-credit-card.use-case'
import { GetCreditCardUseCase } from './use-case/get-credit-card.use-case'

@Module({
  controllers: [CreditCardController],
  providers: [
    PrismaService,
    GetCreditCardUseCase,
    CreateCreditCardUseCase,
    {
      provide: CreditCardRepository,
      useClass: PrismaCreditCardRepository
    }
  ],
  imports: [AuthModule]
})
export class CreditCardModule {}
