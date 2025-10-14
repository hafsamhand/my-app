import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface JwtUser {
  userId: string;
  username?: string;
  email?: string;
  roles?: string[];
}

@Controller('example')
export class ExampleController {
  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtected(@Req() req: Request & { user?: JwtUser }) {
    const user = req.user;
    return { message: 'Protected data', user, secretData: '42' };
  }
}
