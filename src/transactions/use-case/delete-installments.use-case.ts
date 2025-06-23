import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { TransactionRepository } from '../repositories/transaction.repository'
import { errors } from '../../../constants/errors'

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
      throw new NotFoundException(errors.TRANSACTION_NOT_FOUND)
    }

    // Verificar se a transação tem purchaseId (é parte de uma compra parcelada)
    if (!transaction.purchaseId) {
      throw new NotFoundException(errors.NOT_PART_OF_A_PARCELIZED_PURCHASE)
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
