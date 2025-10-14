import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

/**
 * Simple guard that verifies the JWT from cookie.
 * Use as @UseGuards(JwtAuthGuard) on controllers/routes.
 */

interface AuthenticatedRequest extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
}

@Injectable()
export class JwtStrategy implements CanActivate {
  constructor(private authService: AuthService) {}

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
