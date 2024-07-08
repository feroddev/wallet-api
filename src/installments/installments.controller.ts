import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { InstallmentsService } from './installments.service';
import { CustomAuthGuard } from 'src/auth/guards/CustomAuthGuard';

/* @UseGuards(CustomAuthGuard) */
@Controller('installments')
export class InstallmentsController {
  constructor(private readonly installmentsService: InstallmentsService) {}

  @Get()
  async findAll(@Req() {user}) {
    const userId = user.id;
    return await this.installmentsService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Req() {user},@Param('id') id: string) {
    const userId = user.id;
    return await this.installmentsService.findOne(userId, id);
  }

  @Get('month/:month')
  async findByMonth(@Req() {user}, @Param('month') month: string) {
    const userId = user.id;
    return await this.installmentsService.findByMonth(userId, month);
  }

  @Patch(':id/paid')
  async updatePaid(@Req() {user}, @Param('id') id: string) {
    const userId = user.id;
    return await this.installmentsService.updatePaid(userId, id);
  }
}
