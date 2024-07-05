import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSalaryDto } from './create-salary.dto';

export class UpdateSalaryDto extends PartialType(OmitType(CreateSalaryDto, ['userId'] as const)) {}
