export class PrismaTransactionRepository implements TransactionRepository {
    constructor(private readonly prisma: PrismaService) {}

  async create(data: Transaction): Promise<Transaction> {
      return this.prisma.transaction.create({
        data,
      })
  }

  async find(data: Partial<Transaction>): Promise<Transaction> {
      return this.prisma.transaction.findFirst({
        where: data,
      })
  }

  async findMany(data: Partial<Transaction>): Promise<Transaction[]> {
      return this.prisma.transaction.findMany({
        where: data,
      })
  }

  async update(id: string, data: Partial<Transaction>): Promise<Transaction> {
      return this.prisma.transaction.findMany({
        where: data,
      })
  }

  async delete(id: string) {
    await this.prisma.transaction.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}