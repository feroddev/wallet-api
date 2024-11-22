import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/sign.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return null;
    }
    return user;
  }

  async login(user) {
    const payload = { id: user.id };
    return {
      token: this.jwt.sign(payload),
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

  async name({ id }: { id: string }) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
      },
    });
  }
}
