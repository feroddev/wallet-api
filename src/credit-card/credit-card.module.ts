import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaSplitOrRecurrenceRepository } from '../transactions/infra/database/prisma/prisma-split-or-recurrence.repository'
import { SplitOrRecurrenceRepository } from '../transactions/repositories/split-or-recurrence.repository'
import { PrismaCreditCardRepository } from './infra/database/prisma/prisma-credit-card.repository'
import { CreditCardController } from './infra/http/controllers/credit-card.controller'
import { CreditCardRepository } from './repositories/credit-card.repository'
import { CreateCreditCardUseCase } from './use-case/create-credit-card.use-case'
import { DeleteCreditCardUseCase } from './use-case/delete-credit-card.use-case'
import { GetCreditCardUseCase } from './use-case/get-credit-card.use-case'
import { GetInvoicesUseCase } from './use-case/get-invoices.use-case'

@Module({
  controllers: [CreditCardController],
  providers: [
    PrismaService,
    GetCreditCardUseCase,
    CreateCreditCardUseCase,
    GetInvoicesUseCase,
    DeleteCreditCardUseCase,
    {
      provide: CreditCardRepository,
      useClass: PrismaCreditCardRepository
    },
    {
      provide: SplitOrRecurrenceRepository,
      useClass: PrismaSplitOrRecurrenceRepository
    }
  ],
  imports: [AuthModule]
})
export class CreditCardModule {}
