import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Saving } from '@prisma/client';

@Injectable()
export class SavingsService {
  constructor(private prisma: PrismaService) {}

  create(data: any): Promise<Saving> {
    return this.prisma.saving.create({ data });
  }

  findAll(): Promise<Saving[]> {
    return this.prisma.saving.findMany();
  }

  findOne(id: number): Promise<Saving | null> {
    return this.prisma.saving.findUnique({ where: { id } });
  }

  update(id: number, data: any): Promise<Saving> {
    return this.prisma.saving.update({ where: { id }, data });
  }

  remove(id: number): Promise<Saving> {
    return this.prisma.saving.delete({ where: { id } });
  }
}
