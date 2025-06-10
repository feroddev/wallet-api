import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class GetInvoicesDto {
  @IsOptional()
  @IsString()
  creditCardId?: string

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  month?: number

  @IsOptional()
  @IsNumber()
  @Min(2020)
  year?: number
}
