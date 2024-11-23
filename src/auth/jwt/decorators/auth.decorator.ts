import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtGuard } from '../jwt.guard'

export function Auth() {
  return applyDecorators(UseGuards(JwtGuard))
}
