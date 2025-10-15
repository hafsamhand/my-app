import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
/**
 * Simple guard that verifies the JWT from cookie.
 * Use as @UseGuards(JwtAuthGuard) on controllers/routes.
 */

interface AuthenticatedRequest extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) implements CanActivate {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  validate(payload: any): unknown {
    const userId = payload.sub;
    if (!userId) {
      throw new Error('Method not implemented.');
    }
    return payload;
  }
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'changeme',
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { cookies?: Record<string, string> }>();
    const cookieName = process.env.COOKIE_NAME || 'jid';
    const token =
      req.cookies?.[cookieName] ||
      (req.headers?.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : undefined);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.authService.verifyToken(token);
      // attach user payload to request for controllers
      (req as AuthenticatedRequest).user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
