import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { CreateSavingDto } from './dtos/create-saving.dto';
import { UpdateSavingDto } from './dtos/update-saving.dto';

@Controller('api/savings')
export class SavingsController {
  constructor(private readonly service: SavingsService) {}

  @Post()
  create(@Body() dto: CreateSavingDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSavingDto) {
    return this.service.update(id, dto as any);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
