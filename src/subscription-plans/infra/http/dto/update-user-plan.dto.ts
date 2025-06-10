import { IsNotEmpty, IsUUID } from 'class-validator'

export class UpdateUserPlanDto {
  @IsNotEmpty()
  @IsUUID()
  planId: string
}
