import { Transform } from 'class-transformer'
import { IsBoolean, IsDate, IsOptional } from 'class-validator'

export class GetBillsDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isPaid?: boolean

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isRecurring?: boolean

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  dueDateStart?: Date

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  dueDateEnd?: Date
}
