import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly service: LoginService) {}
  
  @Post()
  async login(@Body() body: LoginDto){
    return await this.service.login(body);
  }
}
