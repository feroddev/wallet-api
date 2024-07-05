import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InstallmentsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(userId: string) {
    return await this.prisma.installment.findMany({
      where: {
        userId,
      },
      orderBy: [{ expense: { id: 'asc' } }, { currentInstallment: 'asc' }],
      select: {
        id: true,
        amount: true,
        dueDate: true,
        currentInstallment: true,
        paid: true,
        expense: {
          select: {
            description: true,
            recurring: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(userId: string, id: string) {
    try {
      return await this.prisma.installment.findFirst({
        where: {
          id,
          userId,
        },
        orderBy: [{ expense: { id: 'asc' } }, { currentInstallment: 'asc' }],
        select: {
          id: true,
          amount: true,
          dueDate: true,
          currentInstallment: true,
          paid: true,
          expense: {
            select: {
              description: true,
              recurring: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Installment not found');
    }
  }

  async findByMonth(userId: string, month: string) {
    return await this.prisma.installment.findMany({
      where: {
        userId,
        dueDate: {
          gte: new Date(`${month}-01`),
          lt: new Date(`${month}-31`),
        },
      },
      orderBy: [{ expense: { id: 'asc' } }, { currentInstallment: 'asc' }],
      select: {
        id: true,
        amount: true,
        dueDate: true,
        currentInstallment: true,
        paid: true,
        expense: {
          select: {
            description: true,
            category: {
              select: {
                name: true,
              },
            },
            recurring: true,
          },
        },
      },
    });
  }

  async updatePaid(userId: string, id: string) {
    try {
      await this.prisma.installment.update({
        where: {
          id,
          userId,
        },
        data: {
          paid: true,
        },
      });
      return { message: 'Installment paid' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new UnauthorizedException(
          'You are not authorized to paid this installment',
        );
      }
      throw new NotFoundException('Installment not found');
    }
  }
}
