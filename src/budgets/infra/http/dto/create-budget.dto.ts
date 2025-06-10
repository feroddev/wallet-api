import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min } from 'class-validator'

export class CreateBudgetDto {
  @IsNotEmpty()
  @IsString()
  category: string

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  limit: number

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(12)
  month: number

  @IsNotEmpty()
  @IsInt()
  @Min(2000)
  year: number
}
