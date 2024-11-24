export class PrismaCategoryRepository implements CategoryRepository {
    constructor(private readonly prisma: PrismaService) {}

  async create(data: Category): Promise<Category> {
      return this.prisma.category.create({
        data,
      })
  }

  async find(data: Partial<Category>): Promise<Category> {
      return this.prisma.category.findFirst({
        where: data,
      })
  }

  async findMany(data: Partial<Category>): Promise<Category[]> {
      return this.prisma.category.findMany({
        where: data,
      })
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
      return this.prisma.category.findMany({
        where: data,
      })
  }

  async delete(id: string) {
    await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}