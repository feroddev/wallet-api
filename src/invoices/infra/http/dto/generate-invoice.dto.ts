import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'

export class GenerateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  creditCardId: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number

  @IsNotEmpty()
  @IsNumber()
  @Min(2020)
  year: number
}
