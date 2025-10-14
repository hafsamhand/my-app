import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from '../auth/dtos/register.dto';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.usersService.createUser(dto.email, dto.password);
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }
}
