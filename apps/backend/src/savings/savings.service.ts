import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Saving, SavingStatus, Prisma } from '@prisma/client';
import { CreateSavingDto } from './dtos/create-saving.dto';
import { UpdateSavingDto } from './dtos/update-saving.dto';
import { FilterSavingsDto } from './dtos/filter-savings.dto';

@Injectable()
export class SavingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSavingDto, userId: number): Promise<Saving> {
    // Use authenticated user if saverId not provided
    const saverId = data.saverId ?? userId;

    // Ensure user is creating saving for themselves
    if (saverId !== userId) {
      throw new ForbiddenException('You can only create savings for yourself');
    }

    const transformedData: Prisma.SavingCreateInput = {
      saver: { connect: { id: saverId } },
      currency: { connect: { code: data.currencyCode } },
      amount: data.amount,
      savingDate: new Date(data.savingDate),
      savingPlace: data.savingPlace,
      reason: data.reason,
      status: (data.status as SavingStatus) || 'active',
    };

    return this.prisma.saving.create({
      data: transformedData,
      include: {
        saver: { select: { id: true, fullname: true, email: true } },
        currency: true,
      },
    });
  }

  async findAll(userId: number, filters?: FilterSavingsDto): Promise<Saving[]> {
    const where: Prisma.SavingWhereInput = {
      deletedAt: null,
      saverId: userId,
    };

    if (filters) {
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.currencyCode) {
        where.currencyCode = filters.currencyCode;
      }
      if (filters.startDate || filters.endDate) {
        where.savingDate = {};
        if (filters.startDate) {
          where.savingDate.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          where.savingDate.lte = new Date(filters.endDate);
        }
      }
      if (filters.savingPlace) {
        where.savingPlace = { contains: filters.savingPlace };
      }
    }

    return this.prisma.saving.findMany({
      where,
      include: {
        saver: { select: { id: true, fullname: true, email: true } },
        currency: true,
      },
      orderBy: { savingDate: 'desc' },
    });
  }

  async findOne(id: number, userId: number): Promise<Saving> {
    const saving = await this.prisma.saving.findFirst({
      where: {
        id,
        deletedAt: null,
        saverId: userId,
      },
      include: {
        saver: { select: { id: true, fullname: true, email: true } },
        currency: true,
      },
    });

    if (!saving) {
      throw new NotFoundException('Saving not found');
    }

    return saving;
  }

  async update(id: number, data: UpdateSavingDto, userId: number): Promise<Saving> {
    // Check if saving exists and user has access
    await this.findOne(id, userId);

    const updateData: Prisma.SavingUpdateInput = {};

    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.currencyCode !== undefined) {
      updateData.currency = { connect: { code: data.currencyCode } };
    }
    if (data.savingDate !== undefined) {
      updateData.savingDate = new Date(data.savingDate);
    }
    if (data.savingPlace !== undefined) {
      updateData.savingPlace = data.savingPlace;
    }
    if (data.reason !== undefined) {
      updateData.reason = data.reason;
    }
    if (data.status !== undefined) {
      updateData.status = data.status as SavingStatus;
    }

    return this.prisma.saving.update({
      where: { id },
      data: updateData,
      include: {
        saver: { select: { id: true, fullname: true, email: true } },
        currency: true,
      },
    });
  }

  async remove(id: number, userId: number): Promise<Saving> {
    // Check if saving exists and user has access
    await this.findOne(id, userId);

    // Soft delete
    return this.prisma.saving.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStatistics(userId: number) {
    const where: Prisma.SavingWhereInput = {
      deletedAt: null,
      saverId: userId,
    };

    const [total, byStatus, byCurrency, byPlace, byMonth] = await Promise.all([
      // Total savings
      this.prisma.saving.aggregate({
        where: { ...where, status: 'active' },
        _sum: { amount: true },
        _count: true,
      }),
      // Count by status
      this.prisma.saving.groupBy({
        by: ['status'],
        where,
        _count: true,
        _sum: { amount: true },
      }),
      // Total by currency
      this.prisma.saving.groupBy({
        by: ['currencyCode'],
        where: { ...where, status: 'active' },
        _count: true,
        _sum: { amount: true },
      }),
      // Total by saving place
      this.prisma.saving.groupBy({
        by: ['savingPlace'],
        where: { ...where, status: 'active' },
        _count: true,
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 10,
      }),
      // Savings by month (last 12 months)
      this.prisma.$queryRaw<
        Array<{ month: string; total: number; count: number }>
      >`
        SELECT 
          DATE_FORMAT(savingDate, '%Y-%m') as month,
          SUM(amount) as total,
          COUNT(*) as count
        FROM Saving
        WHERE saverId = ${userId}
          AND deletedAt IS NULL
          AND savingDate >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY month
        ORDER BY month DESC
      `,
    ]);

    return {
      activeTotal: {
        amount: total._sum.amount || 0,
        count: total._count,
      },
      byStatus: byStatus.map((item) => ({
        status: item.status,
        count: item._count,
        totalAmount: item._sum.amount || 0,
      })),
      byCurrency: byCurrency.map((item) => ({
        currencyCode: item.currencyCode,
        count: item._count,
        totalAmount: item._sum.amount || 0,
      })),
      byPlace: byPlace.map((item) => ({
        place: item.savingPlace,
        count: item._count,
        totalAmount: item._sum.amount || 0,
      })),
      byMonth: byMonth,
    };
  }
}
