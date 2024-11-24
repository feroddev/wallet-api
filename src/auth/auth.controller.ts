import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post
} from '@nestjs/common'
import { CreateUserDto } from '../user/infra/http/dto/create-user.dto'
import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body)
  }

  @HttpCode(HttpStatus.OK)
  @Post('/forgot-password/:userId/:token')
  async forgotPassword(
    @Param('userId') userId: string,
    @Param('token') token: string,
    @Body() { password }: { password: string }
  ) {
    return this.authService.forgotPassword({ userId, token, password })
  }
}
