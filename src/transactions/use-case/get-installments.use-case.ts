import { Injectable } from '@nestjs/common'
import { GetInstallmentsDto } from '../infra/http/dto/get-installments.dto'
import { InstallmentRepository } from '../repositories/installment.repository'

@Injectable()
export class GetInstallmentsUseCase {
  constructor(private readonly installmentsRepository: InstallmentRepository) {}

  async execute(userId: string, query: GetInstallmentsDto) {
    const installments = await this.installmentsRepository.findMany(
      userId,
      query
    )

    return installments
  }
}
