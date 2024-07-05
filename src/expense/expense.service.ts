import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    const { amount, categoryId, dueDate, description } = createExpenseDto;
    try {
      return await this.prisma.expense.create({
        data: {
          amount,
          description,
          dueDate,
          category: {
            connect: {
              id: categoryId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
        select: {
          id: true,
          amount: true,
          description: true,
          dueDate: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async findAll(userId: string) {
    return await this.prisma.expense.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        amount: true,
        description: true,
        dueDate: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOne(userId: string, id: string) {
    try {
      return await this.prisma.expense.findUnique({
        where: { id, userId },
        select: {
          id: true,
          amount: true,
          description: true,
          dueDate: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new UnauthorizedException(
          'You are not allowed to view an expense that is not yours',
        );
      }
      throw new BadRequestException('Something went wrong');
    }
  }

  async update(userId: string, id: string, updateExpenseDto: UpdateExpenseDto) {
    try {
      return await this.prisma.expense.update({
        where: { id, userId },
        data: {
          ...updateExpenseDto,
        },
        select: {
          id: true,
          amount: true,
          description: true,
          dueDate: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new UnauthorizedException(
          'You are not allowed to change an expense that is not yours',
        );
      }
      throw new BadRequestException('Something went wrong');
    }
  }

  async remove(userId: string, id: string) {
    try{
      return await this.prisma.expense.delete({
      where: { id, userId },
      })
    } catch (error) {
      if (error.code === 'P2025') {
        throw new UnauthorizedException(
          'You are not allowed to delete an expense that is not yours',
        );
      }
      throw new BadRequestException('Something went wrong');
    }
  }
}
