import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { DashboardController } from './infra/http/controllers/dashboard.controller'
import { GetDashboardUseCase } from './use-case/get-dashboard.use-case'

@Module({
  imports: [AuthModule],
  controllers: [DashboardController],
  providers: [GetDashboardUseCase]
})
export class DashboardModule {}
