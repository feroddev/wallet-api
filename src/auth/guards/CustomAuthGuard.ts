import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info: Error) {
    if (err || !user) {
      console.log(info.message);
      
      if (info.message === 'jwt expired') {
        throw new UnauthorizedException('Token expired');
      }
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
