import { CategoryType } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'

export class GetCategoriesDto {
  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType
}
