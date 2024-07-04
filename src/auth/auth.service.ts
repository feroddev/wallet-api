import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignInDto } from './dto/sign.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(body: LoginDto) {
    const { email, password } = body;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      token: this.jwt.sign({ id: user.id }),
    };
  }

  async signIn(body: SignInDto) {
    const password = await bcrypt.hash(body.password, 10);
    const { name, email } = body;
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    return {
      token: this.jwt.sign({ id: user.id }),
    };
  }
}
