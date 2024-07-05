import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { InstallmentsService } from './installments.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
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
}
