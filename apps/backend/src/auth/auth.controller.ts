import { Body, Controller, Post, Res, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { UsersService } from '../users/users.service';
import { Response, Request } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.usersService.createUser(dto.email, dto.password, dto.fullname);
    return { id: user.id, email: user.email };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      res.status(401);
      return { status: 'error', message: 'Invalid credentials' };
    }

    const token = this.authService.signPayload({ sub: String(user.id), email: user.email });
    // Set HttpOnly cookie
    const cookieName = process.env.COOKIE_NAME || 'jid';
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hour
    });
    // Return token in response for localStorage (in addition to HttpOnly cookie)
    // This allows the frontend to store it for Authorization header
    return { status: 'ok', token, user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    const cookieName = process.env.COOKIE_NAME || 'jid';
    res.clearCookie(cookieName);
    return { status: 'ok' };
  }

  @Get('me')
  async me(@Req() req: Request) {
    // simple endpoint to check cookie-based auth on backend side
    const cookieName = process.env.COOKIE_NAME || 'jid';
    let token = req.cookies?.[cookieName];

    // Also check Authorization header
    if (!token && req.headers?.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return { user: null };
    try {
      const payload = this.authService.verifyToken(token);
      return { user: payload };
    } catch {
      return { user: null };
    }
  }
}
