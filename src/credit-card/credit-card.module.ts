import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaCreditCardExpenseRepository } from '../transactions/infra/database/prisma/prisma-credit-card-expense.repository'
import { CreditCardExpenseRepository } from '../transactions/repositories/credit-card-expense.repository'
import { PrismaCreditCardRepository } from './infra/database/prisma/prisma-credit-card.repository'
import { CreditCardController } from './infra/http/controllers/credit-card.controller'
import { CreditCardRepository } from './repositories/credit-card.repository'
import { CreateCreditCardUseCase } from './use-case/create-credit-card.use-case'
import { DeleteCreditCardUseCase } from './use-case/delete-credit-card.use-case'
import { FindCreditCardUseCase } from './use-case/find-credit-card.use-case'
import { GetCreditCardUseCase } from './use-case/get-credit-card.use-case'
import { UpdateCreditCardUseCase } from './use-case/update-credit-card.use-case'

@Module({
  controllers: [CreditCardController],
  providers: [
    GetCreditCardUseCase,
    CreateCreditCardUseCase,
    DeleteCreditCardUseCase,
    FindCreditCardUseCase,
    UpdateCreditCardUseCase,
    {
      provide: CreditCardRepository,
      useClass: PrismaCreditCardRepository
    },
    {
      provide: CreditCardExpenseRepository,
      useClass: PrismaCreditCardExpenseRepository
    }
  ],
  imports: [AuthModule]
})
export class CreditCardModule {}
