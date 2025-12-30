/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Loan } from '@prisma/client';
@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(data: any): Promise<Loan> {
    const transformedData = {
      ...data,
      borrowingDate: new Date(data.borrowingDate),
      dueDate: new Date(data.dueDate),
    };
    return this.prisma.loan.create({ data: transformedData });
  }

  findAll(): Promise<Loan[]> {
    return this.prisma.loan.findMany();
  }

  findOne(id: number): Promise<Loan | null> {
    return this.prisma.loan.findUnique({ where: { id } });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(id: number, data: any): Promise<Loan> {
    return this.prisma.loan.update({ where: { id }, data });
  }

  remove(id: number): Promise<Loan> {
    return this.prisma.loan.delete({ where: { id } });
  }
}
