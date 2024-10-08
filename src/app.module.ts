import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ExpenseModule } from './expense/expense.module';
import { InstallmentsModule } from './installments/installments.module';
import { SalaryModule } from './salary/salary.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CategoryModule,
    ExpenseModule,
    InstallmentsModule,
    SalaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
