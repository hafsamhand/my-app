import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    return this.usersService.validateUser(email, password);
  }

  signPayload(payload: any) {
    const secret = process.env.JWT_SECRET || 'changeme';
    const expiresIn = process.env.JWT_EXPIRES_IN || '3600s';
    return jwt.sign(payload, secret, { expiresIn });
  }

  verifyToken(token: string) {
    try {
      const secret = process.env.JWT_SECRET || 'changeme';
      return jwt.verify(token, secret);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
