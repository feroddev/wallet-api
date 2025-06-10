import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { CreateBillUseCase } from '../../../use-case/create-bill.use-case'
import { DeleteBillUseCase } from '../../../use-case/delete-bill.use-case'
import { GetBillsUseCase } from '../../../use-case/get-bills.use-case'
import { PayBillUseCase } from '../../../use-case/pay-bill.use-case'
import { UpdateBillUseCase } from '../../../use-case/update-bill.use-case'
import { CreateBillDto } from '../dto/create-bill.dto'
import { GetBillsDto } from '../dto/get-bills.dto'
import { UpdateBillDto } from '../dto/update-bill.dto'

@Auth()
@Controller('bills')
export class BillsController {
  constructor(
    private createBillUseCase: CreateBillUseCase,
    private getBillsUseCase: GetBillsUseCase,
    private updateBillUseCase: UpdateBillUseCase,
    private payBillUseCase: PayBillUseCase,
    private deleteBillUseCase: DeleteBillUseCase
  ) {}

  @Post()
  async create(
    @Body() body: CreateBillDto,
    @Jwt() { userId }: JwtPayload
  ) {
    const { name, description, amount, dueDate, isRecurring, recurrenceDay } = body

    const bill = await this.createBillUseCase.execute({
      userId,
      name,
      description,
      amount,
      dueDate,
      isRecurring,
      recurrenceDay
    })

    return {
      bill
    }
  }

  @Get()
  async getBills(
    @Query() query: GetBillsDto,
    @Jwt() { userId }: JwtPayload
  ) {
    const { isPaid, isRecurring, dueDateStart, dueDateEnd } = query

    const bills = await this.getBillsUseCase.execute({
      userId,
      isPaid,
      isRecurring,
      dueDateStart,
      dueDateEnd
    })

    return {
      bills
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBillDto,
    @Jwt() { userId }: JwtPayload
  ) {
    const { name, description, amount, dueDate, isRecurring, recurrenceDay } = body

    const bill = await this.updateBillUseCase.execute({
      id,
      userId,
      name,
      description,
      amount,
      dueDate,
      isRecurring,
      recurrenceDay
    })

    return {
      bill
    }
  }

  @Patch(':id/pay')
  async pay(
    @Param('id') id: string,
    @Jwt() { userId }: JwtPayload
  ) {
    const bill = await this.payBillUseCase.execute({
      id,
      userId
    })

    return {
      bill
    }
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Jwt() { userId }: JwtPayload
  ) {
    await this.deleteBillUseCase.execute({
      id,
      userId
    })

    return {
      message: 'Conta removida com sucesso'
    }
  }
}
