import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
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
}
