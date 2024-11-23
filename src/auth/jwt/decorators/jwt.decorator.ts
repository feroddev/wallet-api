import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import type { JwtPayload } from '../interfaces/jwt-payload.interface'

export const Jwt = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    return request.user as JwtPayload
  }
)
