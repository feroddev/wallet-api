import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { JwtValidationUseCase } from './use-cases/jwt-validation.use-case'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtValidationUseCase: JwtValidationUseCase) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    })
  }

  async validate<T extends JwtPayload>(payload: T) {
    return this.jwtValidationUseCase.execute(payload)
  }
}
