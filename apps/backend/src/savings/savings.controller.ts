import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { SavingsService } from './savings.service';
import { CreateSavingDto } from './dtos/create-saving.dto';
import { UpdateSavingDto } from './dtos/update-saving.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { FilterSavingsDto } from './dtos/filter-savings.dto';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: number;
    email?: string;
    username?: string;
  };
}

@Controller('api/savings')
@UseGuards(JwtAuthGuard)
export class SavingsController {
  constructor(private readonly service: SavingsService) {}

  @Post()
  create(@Body() dto: CreateSavingDto, @Req() req: AuthenticatedRequest) {
    const userId = typeof req.user?.sub === 'string' ? parseInt(req.user.sub, 10) : req.user?.sub;
    return this.service.create(dto, userId);
  }

  @Get()
  findAll(@Query() filters: FilterSavingsDto, @Req() req: AuthenticatedRequest) {
    const userId = typeof req.user?.sub === 'string' ? parseInt(req.user.sub, 10) : req.user?.sub;
    return this.service.findAll(userId, filters);
  }

  @Get('statistics')
  getStatistics(@Req() req: AuthenticatedRequest) {
    const userId = typeof req.user?.sub === 'string' ? parseInt(req.user.sub, 10) : req.user?.sub;
    return this.service.getStatistics(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    const userId = typeof req.user?.sub === 'string' ? parseInt(req.user.sub, 10) : req.user?.sub;
    return this.service.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSavingDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = typeof req.user?.sub === 'string' ? parseInt(req.user.sub, 10) : req.user?.sub;
    return this.service.update(id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    const userId = typeof req.user?.sub === 'string' ? parseInt(req.user.sub, 10) : req.user?.sub;
    return this.service.remove(id, userId);
  }
}
