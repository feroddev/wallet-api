import { Body, Controller, Post } from '@nestjs/common'

@Auth()
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }
}
