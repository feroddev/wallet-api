import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SalaryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, createSalaryDto: CreateSalaryDto) {
    return await this.prisma.salary.create({
      data: {
        ...createSalaryDto,
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
      },
    });
  }

  async findAll(userId: string) {
    return await this.prisma.salary.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        amount: true,
        description: true,
      },
    });
  }

  async update(userId: string, id: string, updateSalaryDto: UpdateSalaryDto) {
    try {
      return await this.prisma.salary.update({
        where: {
          id,
          userId,
        },
        data: updateSalaryDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new UnauthorizedException(
          'You are not authorized to update this salary',
        );
      }
      throw new BadRequestException('Something went wrong');
    }
  }

  async remove(userId: string, id: string) {
    try {
      return await this.prisma.salary.delete({
        where: {
          id,
          userId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new UnauthorizedException(
          'You are not authorized to delete this salary',
        );
      }
      throw new BadRequestException('Something went wrong');
    }
  }
}
