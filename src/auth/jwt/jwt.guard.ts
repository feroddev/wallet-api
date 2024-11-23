import {
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import * as jwt from 'jsonwebtoken'
import { errors } from '../../../constants/errors'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
        context.getHandler(),
        context.getClass()
      ])

      if (isPublic) {
        return true
      }

      const request = context.switchToHttp().getRequest()
      const token = request.headers.authorization?.split(' ')[1]

      if (!token) {
        throw new ForbiddenException(errors.TOKEN_NOT_FOUND)
      }

      const payload: JwtPayload = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as JwtPayload

      const canActivate = (await super.canActivate(context)) as boolean

      return canActivate
    } catch (error) {
      throw new ForbiddenException(error)
    }
  }
}
