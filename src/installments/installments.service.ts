import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InstallmentsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(userId: string) {
    return await this.prisma.installment.findMany({
      where: {
        userId,
      }
    });
  }

  async findOne(userId:string ,id: string) {
    try {
      return await this.prisma.installment.findFirst({
        where: {
          id,
          userId,
        },
      });
    } catch (error) {
      throw new NotFoundException('Installment not found');
    }
  }

}
