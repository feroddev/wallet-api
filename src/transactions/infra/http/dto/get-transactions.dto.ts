import { IsOptional, IsString } from 'class-validator'

export class GetTransactionsDto {
  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  creditCardId?: string
}
