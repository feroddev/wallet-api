import { Installment } from '@prisma/client'
import { CreateInstallmentDto } from '../infra/http/dto/create-installment.dto'
import { GetInstallmentsDto } from '../infra/http/dto/get-installments.dto'

export abstract class InstallmentRepository {
  abstract create(data: CreateInstallmentDto): Promise<Installment>

  abstract find(data: Partial<Installment>): Promise<Installment>

  abstract findMany(
    userId: string,
    data: GetInstallmentsDto
  ): Promise<Installment[]>

  abstract update(
    id: string,
    userId: string,
    data: Partial<Installment>
  ): Promise<Installment>

  abstract delete(id: string): Promise<void>

  abstract createMany(data: CreateInstallmentDto[]): Promise<Installment[]>
}
