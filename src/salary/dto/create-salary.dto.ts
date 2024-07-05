import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSalaryDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  userId: string;
}
