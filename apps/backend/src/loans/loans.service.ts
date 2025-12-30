import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Loan, LoanStatus, Prisma } from '@prisma/client';
import { CreateLoanDto } from './dtos/create-loan.dto';
import { UpdateLoanDto } from './dtos/update-loan.dto';
import { FilterLoansDto } from './dtos/filter-loans.dto';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLoanDto, userId: number): Promise<Loan> {
    // Default loanerId to authenticated user (the person creating the loan)
    const loanerId = data.loanerId ?? userId;
    
    // BorrowerId must be provided and must be different from loaner
    if (!data.borrowerId) {
      throw new ForbiddenException('Borrower ID is required');
    }
    
    const borrowerId = data.borrowerId;

    // Ensure the authenticated user is the loaner (they're lending money)
    if (loanerId !== userId) {
      throw new ForbiddenException('You can only create loans where you are the loaner');
    }

    // Ensure borrower is different from loaner
    if (loanerId === borrowerId) {
      throw new ForbiddenException('Borrower must be different from loaner');
    }

    const transformedData: Prisma.LoanCreateInput = {
      loaner: { connect: { id: loanerId } },
      borrower: { connect: { id: borrowerId } },
      currency: { connect: { code: data.currencyCode } },
      amount: data.amount,
      borrowingDate: new Date(data.borrowingDate),
      dueDate: new Date(data.dueDate),
      status: (data.status as LoanStatus) || 'active',
      prolongementDuration: data.prolongementDuration,
    };

    return this.prisma.loan.create({
      data: transformedData,
      include: {
        loaner: { select: { id: true, fullname: true, email: true } },
        borrower: { select: { id: true, fullname: true, email: true } },
        currency: true,
      },
    });
  }

  async findAll(userId: number, filters?: FilterLoansDto): Promise<Loan[]> {
    const where: Prisma.LoanWhereInput = {
      deletedAt: null,
      OR: [{ loanerId: userId }, { borrowerId: userId }],
    };

    if (filters) {
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.currencyCode) {
        where.currencyCode = filters.currencyCode;
      }
      if (filters.startDate || filters.endDate) {
        where.borrowingDate = {};
        if (filters.startDate) {
          where.borrowingDate.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          where.borrowingDate.lte = new Date(filters.endDate);
        }
      }
      if (filters.loanerId) {
        where.loanerId = filters.loanerId;
      }
      if (filters.borrowerId) {
        where.borrowerId = filters.borrowerId;
      }
    }

    return this.prisma.loan.findMany({
      where,
      include: {
        loaner: { select: { id: true, fullname: true, email: true } },
        borrower: { select: { id: true, fullname: true, email: true } },
        currency: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number): Promise<Loan> {
    const loan = await this.prisma.loan.findFirst({
      where: {
        id,
        deletedAt: null,
        OR: [{ loanerId: userId }, { borrowerId: userId }],
      },
      include: {
        loaner: { select: { id: true, fullname: true, email: true } },
        borrower: { select: { id: true, fullname: true, email: true } },
        currency: true,
      },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    return loan;
  }

  async update(id: number, data: UpdateLoanDto, userId: number): Promise<Loan> {
    // Check if loan exists and user has access
    const existing = await this.findOne(id, userId);

    const updateData: Prisma.LoanUpdateInput = {};

    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.currencyCode !== undefined) {
      updateData.currency = { connect: { code: data.currencyCode } };
    }
    if (data.borrowingDate !== undefined) {
      updateData.borrowingDate = new Date(data.borrowingDate);
    }
    if (data.dueDate !== undefined) {
      updateData.dueDate = new Date(data.dueDate);
    }
    if (data.status !== undefined) {
      updateData.status = data.status as LoanStatus;
    }
    if (data.prolongementDuration !== undefined) {
      updateData.prolongementDuration = data.prolongementDuration;
    }

    return this.prisma.loan.update({
      where: { id },
      data: updateData,
      include: {
        loaner: { select: { id: true, fullname: true, email: true } },
        borrower: { select: { id: true, fullname: true, email: true } },
        currency: true,
      },
    });
  }

  async remove(id: number, userId: number): Promise<Loan> {
    // Check if loan exists and user has access
    await this.findOne(id, userId);

    // Soft delete
    return this.prisma.loan.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStatistics(userId: number) {
    const where: Prisma.LoanWhereInput = {
      deletedAt: null,
      OR: [{ loanerId: userId }, { borrowerId: userId }],
    };

    const [totalAsLoaner, totalAsBorrower, byStatus, byCurrency, overdueCount] = await Promise.all([
      // Total amount loaned out (as loaner)
      this.prisma.loan.aggregate({
        where: { ...where, loanerId: userId },
        _sum: { amount: true },
        _count: true,
      }),
      // Total amount borrowed (as borrower)
      this.prisma.loan.aggregate({
        where: { ...where, borrowerId: userId },
        _sum: { amount: true },
        _count: true,
      }),
      // Count by status
      this.prisma.loan.groupBy({
        by: ['status'],
        where,
        _count: true,
        _sum: { amount: true },
      }),
      // Total by currency
      this.prisma.loan.groupBy({
        by: ['currencyCode'],
        where,
        _count: true,
        _sum: { amount: true },
      }),
      // Overdue loans
      this.prisma.loan.count({
        where: {
          ...where,
          status: 'active',
          dueDate: { lt: new Date() },
        },
      }),
    ]);

    return {
      asLoaner: {
        totalAmount: totalAsLoaner._sum.amount || 0,
        count: totalAsLoaner._count,
      },
      asBorrower: {
        totalAmount: totalAsBorrower._sum.amount || 0,
        count: totalAsBorrower._count,
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
      overdueCount,
    };
  }
}
