import { Injectable } from '@nestjs/common'
import { JwtPayload } from '../interfaces/jwt-payload.interface'

@Injectable()
export class JwtValidationUseCase {
  execute(payload: JwtPayload): JwtPayload {
    return payload
  }
}
