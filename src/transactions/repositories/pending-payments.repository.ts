import { Prisma } from '@prisma/client'
import { GetBillsDto } from '../../credit-card/infra/http/dto/get-bills.dto'
import { CreatePendingPaymentDto } from '../infra/http/dto/create-pending-payment.dto'
import { GetPendingPaymentsDto } from '../infra/http/dto/get-pending-payments.dto'
import { PayPendingPaymentDto } from '../infra/http/dto/pay-pending-payment.dto'
import { UpdatePendingPaymentDto } from '../infra/http/dto/update-pending-payment.dto'

export abstract class PendingPaymentsRepository {
  abstract createWithTransaction(
    data: CreatePendingPaymentDto[],
    transaction: Prisma.TransactionClient
  ): Promise<any>
  
  abstract create(
    userId: string,
    data: CreatePendingPaymentDto
  ): Promise<any>

  abstract findBills(userId: string, query: GetBillsDto): Promise<any>
  
  abstract findAll(userId: string, filters: GetPendingPaymentsDto): Promise<any>
  
  abstract findById(id: string, userId: string): Promise<any>
  
  abstract update(id: string, userId: string, data: UpdatePendingPaymentDto): Promise<any>
  
  abstract delete(id: string, userId: string): Promise<any>

  abstract payPendingPayment(id: string, userId: string, data: PayPendingPaymentDto): Promise<any>
}
