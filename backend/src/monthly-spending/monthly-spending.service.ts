import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MCategory, TMonthlySpending } from '@prisma/client';

@Injectable()
export class MonthlySpendingService {
  constructor(private prisma: PrismaService) {}

  /**
   * TMonthlyとMCategoryをDBからクライアントに送信
   */
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

  /**
   * 期間を指定してTMonthlyとMCategoryをDBからクライアントに送信
   */
  async getMonthlySpendingByDateRange(startDate: Date, endDate: Date, userID: string) {
    return this.prisma.tMonthlySpending.findMany({
      where: {
        AND: [
          {
            paymentDay: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            userId: userID,
          },
        ],
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * 保存処理
   */
  async postMonthlySpending(postData: TMonthlySpending[]): Promise<TMonthlySpending[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }

    try {
      /** トランザクション処理 */
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();

        const upsertPromises = postData.map(async (data) => {
          if (data.id) {
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
            const verify = await prisma.mCategory.findMany({
              where: {
                AND: [{ sort: data.categorySort }, { userId: data.userId }],
              },
            });
            const checkSort = await prisma.tMonthlySpending.findMany({
              where: {
                userId: data.userId,
              },
            });

            const foundMatchingSort = checkSort.some((s) => s.sort === data.sort);

            if (foundMatchingSort) {
              return;
            } else {
              const { userId, categoryId, id, ...datas } = data;

              // 既存のレコードがない場合は新規作成
              await prisma.tMonthlySpending.create({
                data: {
                  ...datas,
                  createdAt: now.toISOString(),
                  updatedAt: now.toISOString(),
                  paymentDay: new Date(data.paymentDay).toISOString(),
                  userInfo: { connect: { userID: data.userId } },
                  category: { connect: { id: verify.find((a) => a.sort === data.categorySort)?.id } },
                },
              });
            }
          }
        });

        await Promise.all(upsertPromises);
        const userData = postData.find((a) => a.userId)?.userId;

        /** データベースから最新のデータを取得 */
        const latestData = await prisma.tMonthlySpending.findMany({
          where: {
            userId: userData,
          },
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

  /**
   * 削除メソッド
   */
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

        const userData = postData.find((a) => a.userId)?.userId;

        /** データベースから最新のデータを取得 */
        const latestData = await prisma.tMonthlySpending.findMany({
          where: {
            userId: userData,
          },
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

  /**
   * MCategoryの保存
   */
  async postSaveMasterCategoryContent(postData: MCategory[]): Promise<MCategory[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }
    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();
        const upsertPromises = postData.map(async (data) => {
          if (data.id) {
            await prisma.mCategory.update({
              where: {
                id: data.id,
              },
              data: {
                ...data,
                updatedAt: now.toISOString(),
              },
            });
          } else {
            const checkSort = await prisma.mCategory.findMany({
              where: {
                userId: data.userId,
              },
            });

            const foundMatchingSort = checkSort.some((s) => s.sort === data.sort);

            if (foundMatchingSort) {
              return;
            } else {
              const { userId, ...datas } = data;

              await prisma.mCategory.create({
                data: {
                  ...datas,
                  createdAt: now.toISOString(),
                  updatedAt: now.toISOString(),
                  userInfo: { connect: { userID: data.userId } },
                },
              });
            }
          }
        });
        await Promise.all(upsertPromises);
        const userData = postData.find((a) => a.userId)?.userId;

        /** データベースから最新のデータを取得 */
        const latestData = await prisma.mCategory.findMany({
          where: {
            userId: userData,
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
    }
  }
}
