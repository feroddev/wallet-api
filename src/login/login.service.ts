import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LoginService {
  constructor(private readonly prisma: PrismaService) {}

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }
    return { message : 'Login successful' }
  }
}
