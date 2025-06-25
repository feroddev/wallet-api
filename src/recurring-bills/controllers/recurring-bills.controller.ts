import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtGuard } from '../../auth/jwt/jwt.guard'
import {
  CreateRecurringBillDto,
  RecurringBillDto,
  UpdateRecurringBillDto
} from '../dto'
import {
  CreateRecurringBillUseCase,
  DeleteRecurringBillUseCase,
  GetRecurringBillUseCase,
  GetRecurringBillsUseCase,
  UpdateRecurringBillUseCase
} from '../use-case'
import { RecurringBillMapper } from '../mappers/recurring-bill.mapper'
import { Auth } from '../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../auth/jwt/interfaces/jwt-payload.interface'

@Auth()
@ApiTags('Contas Recorrentes')
@Controller('recurring-bills')
@ApiBearerAuth()
export class RecurringBillsController {
  constructor(
    private readonly createRecurringBillUseCase: CreateRecurringBillUseCase,
    private readonly getRecurringBillsUseCase: GetRecurringBillsUseCase,
    private readonly getRecurringBillUseCase: GetRecurringBillUseCase,
    private readonly updateRecurringBillUseCase: UpdateRecurringBillUseCase,
    private readonly deleteRecurringBillUseCase: DeleteRecurringBillUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova conta recorrente' })
  async create(
    @Jwt() { userId }: JwtPayload,
    @Body() createRecurringBillDto: CreateRecurringBillDto
  ): Promise<RecurringBillDto> {
    const recurringBill = await this.createRecurringBillUseCase.execute(
      userId,
      createRecurringBillDto
    )
    return RecurringBillMapper.toDto(recurringBill)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as contas recorrentes do usuário' })
  async findAll(@Jwt() { userId }: JwtPayload): Promise<RecurringBillDto[]> {
    const recurringBills = await this.getRecurringBillsUseCase.execute(userId)
    return RecurringBillMapper.toDtoList(recurringBills)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma conta recorrente específica' })
  async findOne(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string
  ): Promise<RecurringBillDto> {
    const recurringBill = await this.getRecurringBillUseCase.execute(userId, id)
    return RecurringBillMapper.toDto(recurringBill)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma conta recorrente' })
  async update(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string,
    @Body() updateRecurringBillDto: UpdateRecurringBillDto
  ): Promise<RecurringBillDto> {
    const recurringBill = await this.updateRecurringBillUseCase.execute(
      userId,
      id,
      updateRecurringBillDto
    )
    return RecurringBillMapper.toDto(recurringBill)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma conta recorrente' })
  async remove(
    @Jwt() { userId }: JwtPayload,
    @Param('id') id: string
  ): Promise<RecurringBillDto> {
    const recurringBill = await this.deleteRecurringBillUseCase.execute(
      userId,
      id
    )
    return RecurringBillMapper.toDto(recurringBill)
  }
}
