import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { format } from 'date-fns';
import { MCategory } from '@prisma/client';

@Injectable()
export class MonthlySpendingService {
  constructor(private prisma: PrismaService) {}

  /** TMonthlyとMCategoryをDBからクライアントに送信 */
  async getMonthlySpendingWithCategory() {
    return this.prisma.tMonthlySpending.findMany({
      include: {
        category: true,
      },
    });
  }

  /** MCategoryをDBからクライアントに送信 */
  async getCategory(): Promise<MCategory[]> {
    return this.prisma.mCategory.findMany();
  }

  /** 期間を指定してTMonthlyとMCategoryをDBからクライアントに送信 */
  async getMonthlySpendingByDateRange(startDate: Date, endDate: Date) {
    return this.prisma.tMonthlySpending.findMany({
      where: {
        paymentDay: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });
  }
}
