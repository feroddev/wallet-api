import { Test, TestingModule } from '@nestjs/testing'
import { DeleteInstallmentsUseCase } from './delete-installments.use-case'
import { TransactionRepository } from '../repositories/transaction.repository'
import { PrismaService } from '../../prisma/prisma.service'
import { NotFoundException } from '@nestjs/common'
import { errors } from '../../../constants/errors'

describe('DeleteInstallmentsUseCase', () => {
  let useCase: DeleteInstallmentsUseCase
  let transactionRepository: TransactionRepository
  let prismaService: PrismaService

  const mockTransaction = {
    id: 'transaction-1',
    userId: 'user-1',
    purchaseId: 'purchase-1',
    totalInstallments: 3,
    installmentNumber: 1
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteInstallmentsUseCase,
        {
          provide: TransactionRepository,
          useValue: {
            find: jest.fn(),
            deleteAllInstallments: jest.fn()
          }
        },
        {
          provide: PrismaService,
          useValue: {
            executeWithExtendedTimeout: jest.fn((callback) => callback())
          }
        }
      ]
    }).compile()

    useCase = module.get<DeleteInstallmentsUseCase>(DeleteInstallmentsUseCase)
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository
    )
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('deve excluir todas as parcelas de uma compra', async () => {
    jest
      .spyOn(transactionRepository, 'find')
      .mockResolvedValue(mockTransaction as any)
    jest
      .spyOn(transactionRepository, 'deleteAllInstallments')
      .mockResolvedValue({ count: 3 })

    const result = await useCase.execute('user-1', 'transaction-1')

    expect(transactionRepository.find).toHaveBeenCalledWith({
      id: 'transaction-1',
      userId: 'user-1'
    })
    expect(transactionRepository.deleteAllInstallments).toHaveBeenCalledWith(
      'purchase-1',
      'user-1'
    )
    expect(prismaService.executeWithExtendedTimeout).toHaveBeenCalled()
    expect(result).toEqual({
      message:
        'Compra parcelada cancelada com sucesso. 3 parcelas foram excluídas.',
      count: 3
    })
  })

  it('deve lançar erro se a transação não for encontrada', async () => {
    jest.spyOn(transactionRepository, 'find').mockResolvedValue(null)

    await expect(useCase.execute('user-1', 'transaction-1')).rejects.toThrow(
      new NotFoundException(errors.TRANSACTION_NOT_FOUND)
    )
  })

  it('deve lançar erro se a transação não tiver purchaseId', async () => {
    jest.spyOn(transactionRepository, 'find').mockResolvedValue({
      ...mockTransaction,
      purchaseId: null
    } as any)

    await expect(useCase.execute('user-1', 'transaction-1')).rejects.toThrow(
      new NotFoundException(errors.NOT_PART_OF_A_PARCELIZED_PURCHASE)
    )
  })
})
