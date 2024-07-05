import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Req() {user},@Body() createExpenseDto: CreateExpenseDto) {
    const userId = user.id;
    return this.expenseService.create(userId, createExpenseDto);
  }

  @Get()
  findAll(@Req() {user}) {
    const userId = user.id;
    return this.expenseService.findAll(userId);
  }

  @Get(':id')
  findOne(@Req() {user}, @Param('id') id: string) {
    const userId = user.id;
    return this.expenseService.findOne(userId, id);
  }

  @Patch(':id')
  update(@Req() {user}, @Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    const userId = user.id;
    return this.expenseService.update(userId, id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Req() {user}, @Param('id') id: string) {
    const userId = user.id;
    return this.expenseService.remove(userId, id);
  }
}
