import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class UpdateProgressDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number
}
