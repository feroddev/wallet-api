import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateExpenseDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  amount: number;
  
  @IsOptional()
  @IsString()
  @Transform(({ value }) => String(value))
  description?: string;
  
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  categoryId: string;
  
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dueDate: Date;
}
