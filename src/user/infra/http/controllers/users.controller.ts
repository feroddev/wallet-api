import { Body, Controller, Get, Put } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '../../../../auth/jwt/decorators/auth.decorator'
import { Jwt } from '../../../../auth/jwt/decorators/jwt.decorator'
import { JwtPayload } from '../../../../auth/jwt/interfaces/jwt-payload.interface'
import { GetUserUseCase } from '../../../use-cases/get-user.use-case'
import { UpdateUserUseCase } from '../../../use-cases/update-user.use-case'
import { UpdateUserDto } from '../dto/update-user.dto'

@Auth()
@ApiTags('Usuários')
@Controller('/user')
export class UserController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário obtidos com sucesso'
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async getUser(@Jwt() { userId }: JwtPayload) {
    return this.getUserUseCase.execute(userId)
  }

  @Put()
  @ApiOperation({ summary: 'Atualizar dados do usuário autenticado' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário atualizados com sucesso'
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async updateUser(@Body() data: UpdateUserDto, @Jwt() { userId }: JwtPayload) {
    return this.updateUserUseCase.execute(userId, data)
  }
}
