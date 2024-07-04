import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('sign-in')
export class SignInController {
  constructor(private readonly serivce: SignInService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.serivce.create(createUserDto);
  }
}
