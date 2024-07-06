import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { CustomAuthGuard } from 'src/auth/guards/CustomAuthGuard';

@UseGuards(CustomAuthGuard)
@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Post()
  async create(@Req() {user}, @Body() createSalaryDto: CreateSalaryDto) {
    const userId = user.id;
    return await this.salaryService.create(userId, createSalaryDto);
  }

  @Get()
  async findAll(@Req() {user}) {
    const userId = user.id;
    return await this.salaryService.findAll(userId);
  }

  @Patch(':id')
  async update(@Req() {user}, @Param('id') id: string, @Body() updateSalaryDto: UpdateSalaryDto) {
    const userId = user.id;
    return await this.salaryService.update(userId, id, updateSalaryDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Req() {user}, @Param('id') id: string) {
    const userId = user.id;
    return await this.salaryService.remove(userId, id);
  }
}
