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
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dtos/create-loan.dto';
import { UpdateLoanDto } from './dtos/update-loan.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { FilterLoansDto } from './dtos/filter-loans.dto';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: number;
    email?: string;
    username?: string;
  };
}

@Controller('api/loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private readonly service: LoansService) {}

  @Post()
  create(@Body() dto: CreateLoanDto, @Req() req: AuthenticatedRequest) {
    const userId = typeof req.user?.sub === 'string' ? parseInt(req.user.sub, 10) : req.user?.sub;
    return this.service.create(dto, userId);
  }

  @Get()
  findAll(@Query() filters: FilterLoansDto, @Req() req: AuthenticatedRequest) {
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
    @Body() dto: UpdateLoanDto,
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
