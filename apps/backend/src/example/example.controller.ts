import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtStrategy } from '../auth/jwt.strategy';
import { Request } from 'express';

@Controller('api')
export class ExampleController {
  @Get('public')
  getPublic() {
    return { message: 'Hello from public endpoint', time: new Date().toISOString() };
  }

  @UseGuards(JwtStrategy)
  @Get('protected')
  getProtected(@Req() req: Request) {
    const user = (req as any).user;
    return { message: 'Protected data', user, secretData: '42' };
  }
}
