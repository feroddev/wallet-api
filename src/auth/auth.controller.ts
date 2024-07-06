import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignInDto } from './dto/sign.dto';
import { AuthGuard } from '@nestjs/passport';
import { CustomAuthGuard } from './guards/CustomAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any) {
    return await this.service.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() body: SignInDto){
    return this.service.signIn(body);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(CustomAuthGuard)
  @Get('name')
  async name(@Req() req: any) {
    return await this.service.name(req.user);
  }
}
