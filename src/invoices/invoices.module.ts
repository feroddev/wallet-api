import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaInvoiceRepository } from './infra/database/prisma/prisma-invoice.repository'
import { InvoicesController } from './infra/http/controllers/invoices.controller'
import { InvoiceRepository } from './repositories/invoice.repository'
import { GenerateInvoiceUseCase } from './use-case/generate-invoice.use-case'
import { GetInvoicesUseCase } from './use-case/get-invoices.use-case'
import { PayInvoiceUseCase } from './use-case/pay-invoice.use-case'

@Module({
  imports: [AuthModule],
  controllers: [InvoicesController],
  providers: [
    GenerateInvoiceUseCase,
    GetInvoicesUseCase,
    PayInvoiceUseCase,
    {
      provide: InvoiceRepository,
      useClass: PrismaInvoiceRepository
    }
  ],
  exports: [InvoiceRepository]
})
export class InvoicesModule {}
