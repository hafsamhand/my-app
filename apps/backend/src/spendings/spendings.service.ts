import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Spending, Prisma } from '@prisma/client';
import { CreateSpendingDto } from './dtos/create-spending.dto';
import { UpdateSpendingDto } from './dtos/update-spending.dto';
import { FilterSpendingsDto } from './dtos/filter-spendings.dto';

@Injectable()
export class SpendingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSpendingDto, userId: number): Promise<Spending> {
    // Use authenticated user if spenderId not provided
    const spenderId = data.spenderId ?? userId;

    // Ensure user is creating spending for themselves
    if (spenderId !== userId) {
      throw new ForbiddenException('You can only create spendings for yourself');
    }

    const transformedData: Prisma.SpendingCreateInput = {
      spender: { connect: { id: spenderId } },
      currency: { connect: { code: data.currencyCode } },
      amount: data.amount,
      spendingDate: new Date(data.spendingDate),
      spentOn: data.spentOn,
    };

    return this.prisma.spending.create({
      data: transformedData,
      include: {
        spender: { select: { id: true, fullname: true, email: true } },
        currency: true,
      },
    });
  }

  async findAll(userId: number, filters?: FilterSpendingsDto): Promise<Spending[]> {
    const where: Prisma.SpendingWhereInput = {
      deletedAt: null,
      spenderId: userId,
    };

    if (filters) {
      if (filters.currencyCode) {
        where.currencyCode = filters.currencyCode;
      }
      if (filters.startDate || filters.endDate) {
        where.spendingDate = {};
        if (filters.startDate) {
          where.spendingDate.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          where.spendingDate.lte = new Date(filters.endDate);
        }
      }
      if (filters.spentOn) {
        where.spentOn = { contains: filters.spentOn };
      }
    }

    return this.prisma.spending.findMany({
      where,
      include: {
        spender: { select: { id: true, fullname: true, email: true } },
        currency: true,
      },
      orderBy: { spendingDate: 'desc' },
    });
  }

  async findOne(id: number, userId: number): Promise<Spending> {
    const spending = await this.prisma.spending.findFirst({
      where: {
        id,
        deletedAt: null,
        spenderId: userId,
      },
      include: {
        spender: { select: { id: true, fullname: true, email: true } },
        currency: true,
      },
    });

    if (!spending) {
      throw new NotFoundException('Spending not found');
    }

    return spending;
  }

  async update(id: number, data: UpdateSpendingDto, userId: number): Promise<Spending> {
    // Check if spending exists and user has access
    await this.findOne(id, userId);

    const updateData: Prisma.SpendingUpdateInput = {};

    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.currencyCode !== undefined) {
      updateData.currency = { connect: { code: data.currencyCode } };
    }
    if (data.spendingDate !== undefined) {
      updateData.spendingDate = new Date(data.spendingDate);
    }
    if (data.spentOn !== undefined) {
      updateData.spentOn = data.spentOn;
    }

    return this.prisma.spending.update({
      where: { id },
      data: updateData,
      include: {
        spender: { select: { id: true, fullname: true, email: true } },
        currency: true,
      },
    });
  }

  async remove(id: number, userId: number): Promise<Spending> {
    // Check if spending exists and user has access
    await this.findOne(id, userId);

    // Soft delete
    return this.prisma.spending.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStatistics(userId: number) {
    const where: Prisma.SpendingWhereInput = {
      deletedAt: null,
      spenderId: userId,
    };

    const [total, byCurrency, byMonth, topCategories] = await Promise.all([
      // Total spending
      this.prisma.spending.aggregate({
        where,
        _sum: { amount: true },
        _count: true,
        _avg: { amount: true },
      }),
      // Total by currency
      this.prisma.spending.groupBy({
        by: ['currencyCode'],
        where,
        _count: true,
        _sum: { amount: true },
      }),
      // Spending by month (last 12 months)
      this.prisma.$queryRaw<
        Array<{ month: string; total: number; count: number }>
      >`
        SELECT 
          DATE_FORMAT(spendingDate, '%Y-%m') as month,
          SUM(amount) as total,
          COUNT(*) as count
        FROM Spending
        WHERE spenderId = ${userId}
          AND deletedAt IS NULL
          AND spendingDate >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY month
        ORDER BY month DESC
      `,
      // Top spending categories
      this.prisma.spending.groupBy({
        by: ['spentOn'],
        where,
        _sum: { amount: true },
        _count: true,
        orderBy: { _sum: { amount: 'desc' } },
        take: 10,
      }),
    ]);

    return {
      total: {
        amount: total._sum.amount || 0,
        count: total._count,
        average: total._avg.amount || 0,
      },
      byCurrency: byCurrency.map((item) => ({
        currencyCode: item.currencyCode,
        count: item._count,
        totalAmount: item._sum.amount || 0,
      })),
      byMonth: byMonth,
      topCategories: topCategories.map((item) => ({
        category: item.spentOn,
        count: item._count,
        totalAmount: item._sum.amount || 0,
      })),
    };
  }
}
