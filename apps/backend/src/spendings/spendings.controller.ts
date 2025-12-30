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
import { SpendingsService } from './spendings.service';
import { CreateSpendingDto } from './dtos/create-spending.dto';
import { UpdateSpendingDto } from './dtos/update-spending.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { FilterSpendingsDto } from './dtos/filter-spendings.dto';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: number;
    email?: string;
    username?: string;
  };
}

@Controller('api/spendings')
@UseGuards(JwtAuthGuard)
export class SpendingsController {
  constructor(private readonly service: SpendingsService) {}

  @Post()
  create(@Body() dto: CreateSpendingDto, @Req() req: AuthenticatedRequest) {
    const userId = typeof req.user?.sub === 'string' ? parseInt(req.user.sub, 10) : req.user?.sub;
    return this.service.create(dto, userId);
  }

  @Get()
  findAll(@Query() filters: FilterSpendingsDto, @Req() req: AuthenticatedRequest) {
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
    @Body() dto: UpdateSpendingDto,
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
