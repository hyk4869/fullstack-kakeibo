import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MCategory, TMonthlySpending } from '@prisma/client';
import * as fs from 'fs';

@Injectable()
export class MonthlySpendingService {
  constructor(private prisma: PrismaService) {}

  /** TMonthlyとMCategoryをDBからクライアントに送信 */
  async getMonthlySpendingWithCategory() {
    const result = await this.prisma.tMonthlySpending.findMany({
      include: {
        category: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return result;
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

    try {
      /** DBにある全てのidを取得 */
      const existingIds = await this.prisma.tMonthlySpending.findMany({
        select: {
          id: true,
        },
      });

      /** postDataに存在しないidを取得 */
      const missingIds = existingIds
        .filter((existingItem) => !postData.some((item) => item.id === existingItem.id))
        .map((item) => item.id);

      if (missingIds.length > 0) {
        await this.prisma.tMonthlySpending.deleteMany({
          where: {
            id: {
              in: missingIds,
            },
          },
        });
      }

      const now = new Date();

      const postDataWithTimestamp = postData.map((data) => ({
        ...data,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        paymentDay: new Date(data.paymentDay).toISOString(),
      }));

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
