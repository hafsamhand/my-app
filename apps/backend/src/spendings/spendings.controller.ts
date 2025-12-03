import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { SpendingsService } from './spendings.service';
import { CreateSpendingDto } from './dtos/create-spending.dto';
import { UpdateSpendingDto } from './dtos/update-spending.dto';

@Controller('api/spendings')
export class SpendingsController {
  constructor(private readonly service: SpendingsService) {}

  @Post()
  create(@Body() dto: CreateSpendingDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSpendingDto) {
    return this.service.update(id, dto as any);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
