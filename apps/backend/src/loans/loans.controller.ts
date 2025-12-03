import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dtos/create-loan.dto';
import { UpdateLoanDto } from './dtos/update-loan.dto';

@Controller('api/loans')
export class LoansController {
  constructor(private readonly service: LoansService) {}

  @Post()
  create(@Body() dto: CreateLoanDto) {
    return this.service.create(dto as any);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLoanDto) {
    return this.service.update(id, dto as any);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
