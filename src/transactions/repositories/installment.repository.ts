import { Installment } from '@prisma/client'
import { CreateInstallmentDto } from '../infra/http/dto/create-installment.dto'

export abstract class InstallmentRepository {
  abstract create(data: CreateInstallmentDto): Promise<Installment>

  abstract find(data: Partial<Installment>): Promise<Installment>

  abstract findMany(data: Partial<Installment>): Promise<Installment[]>

  abstract update(id: string, data: Partial<Installment>): Promise<Installment>

  abstract delete(id: string): Promise<void>

  abstract createMany(data: CreateInstallmentDto[]): Promise<Installment[]>
}
