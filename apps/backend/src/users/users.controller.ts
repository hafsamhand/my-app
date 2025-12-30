import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from '../auth/dtos/register.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.usersService.createUser(dto.email, dto.password, dto.fullname);
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.usersService.findAll();
  }
}
