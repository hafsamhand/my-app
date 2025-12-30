import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Spending } from '@prisma/client';

@Injectable()
export class SpendingsService {
  constructor(private prisma: PrismaService) {}

  create(data: any): Promise<Spending> {
    const transformedData = {
      ...data,
      spendingDate: new Date(data.spendingDate),
    };
    return this.prisma.spending.create({ data: transformedData });
  }

  findAll(): Promise<Spending[]> {
    return this.prisma.spending.findMany();
  }

  findOne(id: number): Promise<Spending | null> {
    return this.prisma.spending.findUnique({ where: { id } });
  }

  update(id: number, data: any): Promise<Spending> {
    return this.prisma.spending.update({ where: { id }, data });
  }

  remove(id: number): Promise<Spending> {
    return this.prisma.spending.delete({ where: { id } });
  }
}
