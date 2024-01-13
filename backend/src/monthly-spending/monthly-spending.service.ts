import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MCategory, TMonthlySpending } from '@prisma/client';
import * as fs from 'fs';

@Injectable()
export class MonthlySpendingService {
  constructor(private prisma: PrismaService) {}

  /** TMonthlyとMCategoryをDBからクライアントに送信 */
  async getMonthlySpendingWithCategory(userID: string) {
    const result = await this.prisma.tMonthlySpending.findMany({
      where: {
        userId: userID,
      },
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
    return this.prisma.mCategory.findMany({
      orderBy: {
        id: 'asc',
      },
    });
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

  /** 保存処理 */
  async postMonthlySpending(postData: TMonthlySpending[]): Promise<TMonthlySpending[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }

    try {
      /** トランザクション処理 */
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();

        const upsertPromises = postData.map(async (data) => {
          /** IDで既存のレコードを探す */
          const existingRecord = await prisma.tMonthlySpending.findUnique({
            where: {
              id: data.id,
            },
          });

          if (existingRecord) {
            // 既存のレコードがある場合は更新
            await prisma.tMonthlySpending.update({
              where: {
                id: data.id,
              },
              data: {
                ...data,
                updatedAt: now.toISOString(),
                paymentDay: new Date(data.paymentDay).toISOString(),
              },
            });
          } else {
            // 既存のレコードがない場合は新規作成
            await prisma.tMonthlySpending.create({
              data: {
                ...data,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
                paymentDay: new Date(data.paymentDay).toISOString(),
              },
            });
          }
        });

        await Promise.all(upsertPromises);

        /** データベースから最新のデータを取得 */
        const latestData = await prisma.tMonthlySpending.findMany({
          include: {
            category: true,
          },
          orderBy: {
            id: 'asc',
          },
        });

        return latestData;
      });

      return insertedData;
    } catch (error) {
      console.error('データベースへの書き込みエラー:', error);
      throw error;
    }
  }

  /** 削除メソッド */
  async deleteContent(postData: TMonthlySpending[]): Promise<TMonthlySpending[]> {
    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        /** DBにある全てのidを取得 */
        const existingIds = await prisma.tMonthlySpending.findMany({
          select: {
            id: true,
          },
        });

        /** postDataに存在するidを取得 */
        const missingIds = existingIds
          .filter((existingItem) => postData.some((item) => item.id === existingItem.id))
          .map((item) => item.id);

        if (missingIds.length > 0) {
          await prisma.tMonthlySpending.deleteMany({
            where: {
              id: {
                in: missingIds,
              },
            },
          });
        }

        const latestData = await prisma.tMonthlySpending.findMany({
          include: {
            category: true,
          },
          orderBy: {
            id: 'asc',
          },
        });

        return latestData;
      });
      return insertedData;
    } catch (error) {
      console.error('データベースへの書き込みエラー:', error);
      throw error;
    }
  }
}
