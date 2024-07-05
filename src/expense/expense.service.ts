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
    const { amount, categoryId, dueDate, description, recurring } =
      createExpenseDto;
    try {
      const expense = await this.prisma.expense.create({
        data: {
          amount,
          description,
          dueDate,
          recurring: recurring || 1,
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
              name: true,
            },
          },
          recurring: true,
        },
      });

      const recurringExpense = [];
      for (let i = 0; i < expense.recurring; i++) {
        recurringExpense.push(
          this.prisma.installment.create({
            data: {
              currentInstallment: i + 1,
              amount: Number((expense.amount / expense.recurring).toFixed(2)),
              dueDate: new Date(
                new Date(expense.dueDate).setMonth(
                  new Date(expense.dueDate).getMonth() + i,
                ),
              ),
              expense: {
                connect: {
                  id: expense.id,
                },
              },
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          }),
        );
      }
      await Promise.all(recurringExpense);
      return expense;
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
        recurring: true,
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
          recurring: true,
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
    const { recurring } = updateExpenseDto;
    try {
      // Update the expense
      const expense = await this.prisma.expense.update({
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
          installments: {
            select: {
              id: true,
              amount: true,
              dueDate: true,
            },
          },
        },
      });

      // If the expense is not recurring, return the expense
      if (!recurring) {
        return expense;
      }

      // Delete all installments and create new ones
      await this.prisma.installment.deleteMany({
        where: {
          expenseId: expense.id,
        },
      });

      // Create new installments
      const recurringExpense = [];
      for (let i = 0; i < recurring; i++) {
        recurringExpense.push(
          this.prisma.installment.create({
            data: {
              amount: Number((expense.amount / recurring).toFixed(2)),
              dueDate: new Date(
                new Date(expense.dueDate).setMonth(
                  new Date(expense.dueDate).getMonth() + i,
                ),
              ),
              expense: {
                connect: {
                  id: expense.id,
                },
              },
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          }),
        );
      }
      await Promise.all(recurringExpense);
      return expense;
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
    try {
      return await this.prisma.expense.delete({
        where: { id, userId },
      });
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
