import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MCategory, TMonthlySpending } from '@prisma/client';

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

  /** データのPOST　データベースに保存作業を行う */
  async postMonthlySpending(postData: TMonthlySpending[]): Promise<TMonthlySpending[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }
    const now = new Date();

    const postDataWithTimestamp = postData.map((data) => ({
      ...data,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      paymentDay: new Date(data.paymentDay).toISOString(),
    }));

    try {
      await this.prisma.tMonthlySpending.createMany({
        data: postDataWithTimestamp,
        skipDuplicates: true,
      });
      const insertedData = await this.prisma.tMonthlySpending.findMany({});
      return insertedData;
    } catch (error) {
      console.error('データベースへの書き込みエラー:', error);
      throw error;
    }
  }
}
