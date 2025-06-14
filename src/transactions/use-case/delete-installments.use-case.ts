import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { TransactionRepository } from '../repositories/transaction.repository'

@Injectable()
export class DeleteInstallmentsUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionsRepository: TransactionRepository
  ) {}

  async execute(userId: string, transactionId: string) {
    // Buscar a transação para obter o purchaseId
    const transaction = await this.transactionsRepository.find({
      id: transactionId,
      userId
    })

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada')
    }

    // Verificar se a transação tem purchaseId (é parte de uma compra parcelada)
    if (!transaction.purchaseId) {
      throw new NotFoundException('Esta transação não faz parte de uma compra parcelada')
    }

    // Excluir todas as parcelas relacionadas à mesma compra
    return this.prisma.executeWithExtendedTimeout(async () => {
      const result = await this.transactionsRepository.deleteAllInstallments(
        transaction.purchaseId,
        userId
      )

      return {
        message: `Compra parcelada cancelada com sucesso. ${result.count} parcelas foram excluídas.`,
        count: result.count
      }
    })
  }
}
