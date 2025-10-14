import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    return this.usersService.validateUser(email, password);
  }

  signPayload(payload: string | Buffer | jwt.JwtPayload): string {
    const secret: jwt.Secret = (process.env.JWT_SECRET || 'changeme') as jwt.Secret;
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? '3600s') as jwt.SignOptions['expiresIn'];
    return jwt.sign(payload as string | Buffer | jwt.JwtPayload, secret, {
      expiresIn,
    } as jwt.SignOptions) as string;
  }

  verifyToken(token: string) {
    try {
      const secret: jwt.Secret = (process.env.JWT_SECRET || 'changeme') as jwt.Secret;
      return jwt.verify(token, secret);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
