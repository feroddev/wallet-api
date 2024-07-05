import { Injectable, Req } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: createCategoryDto,
      select: {
        id: true,
        name: true,
      }
      });
  }

  async findAll() {
    return await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      }
    });
  }

  async findOne(name: string) {
    return await this.prisma.category.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        }
      },
      select: {
        id: true,
        name: true,
      }
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: { id },
      select: {
        id: true,
        name: true,
      },
      data: updateCategoryDto,
      }
    );
  }

  async remove(id: string) {
    return await this.prisma.category.delete({
      where: { id },
      });
  }
}
