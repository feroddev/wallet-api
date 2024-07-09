import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

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
  @Type(() => Date)
  dueDate: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  recurring?: number;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}
