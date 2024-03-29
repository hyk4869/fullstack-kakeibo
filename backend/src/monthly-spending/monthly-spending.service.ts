import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MCategory, TMonthlySpending } from '@prisma/client';
import { UtilFunctions } from 'src/util/utils';
import { isEqual } from 'lodash';

@Injectable()
export class MonthlySpendingService {
  constructor(private prisma: PrismaService) {}

  private util = new UtilFunctions(this.prisma);

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
        sort: 'asc',
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
   * TMonthlySpendingの保存作業
   * @param postData
   * @returns
   */
  async postMonthlySpending(postData: TMonthlySpending[]): Promise<TMonthlySpending[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }

    try {
      /** トランザクション処理 */
      const insertedData = await this.prisma.$transaction(
        async (prisma) => {
          const now = new Date();

          const upsertPromises = postData.map(async ({ categoryId, userId, ...data }) => {
            /** MCategory */
            const mCategory = await this.util.getFindManyData<MCategory>(
              { sort: data.categorySort, userId: userId },
              this.util.mCategory,
            );
            /** TMonthlySpending */
            const tMonthlySpending = await this.util.getFindManyData<TMonthlySpending>(
              { userId: userId },
              this.util.tMonthlySpending,
            );

            if (data.id) {
              const { createdAt, updatedAt, ...restData } = data;
              const compare = tMonthlySpending.some(({ userId, categoryId, createdAt, updatedAt, ...a }) =>
                isEqual(a, restData),
              );
              // 値が変わっていないものは早期return
              if (compare) return;

              await prisma.tMonthlySpending.update({
                where: {
                  id: data.id,
                },
                data: {
                  ...data,
                  updatedAt: now.toISOString(),
                  paymentDay: new Date(data.paymentDay).toISOString(),
                  userInfo: { connect: { userID: userId } },
                  category: { connect: { id: mCategory.find((a) => a.sort === data.categorySort)?.id } },
                },
              });
            } else {
              const foundMatchingSort = tMonthlySpending.some((s) => s.sort === data.sort);

              if (foundMatchingSort) {
                return;
              } else {
                const { id, ...datas } = data;

                // 既存のレコードがない場合は新規作成
                await prisma.tMonthlySpending.create({
                  data: {
                    ...datas,
                    createdAt: now.toISOString(),
                    updatedAt: now.toISOString(),
                    paymentDay: new Date(data.paymentDay).toISOString(),
                    userInfo: { connect: { userID: userId } },
                    category: { connect: { id: mCategory.find((a) => a.sort === data.categorySort)?.id } },
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
              sort: 'asc',
            },
          });

          return latestData;
        },
        { timeout: 20000 },
      );

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
          where: {
            userId: postData.find((a) => a.userId)?.userId,
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
            sort: 'asc',
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
   * MCategoryの保存作業
   * @param postData
   * @returns
   */
  async postSaveMasterCategoryContent(postData: MCategory[]): Promise<MCategory[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }
    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();

        const upsertPromises = postData.map(async ({ userId, ...data }) => {
          /** mCategory */
          const mCategory = await this.util.getFindManyData<MCategory>({ userId: userId }, this.util.mCategory);

          if (data.id) {
            const { createdAt, updatedAt, ...restData } = data;
            const compare = mCategory.some(({ userId, createdAt, updatedAt, ...a }) => isEqual(a, restData));
            // 値が変わっていないものは早期return
            if (compare) return;

            await prisma.mCategory.update({
              where: {
                id: data.id,
              },
              data: {
                ...data,
                updatedAt: now.toISOString(),
                userInfo: { connect: { userID: userId } },
              },
            });
          } else {
            const foundMatchingSort = mCategory.some((s) => s.sort === data.sort);

            if (foundMatchingSort) {
              return;
            } else {
              const { id, ...datas } = data;

              await prisma.mCategory.create({
                data: {
                  ...datas,
                  createdAt: now.toISOString(),
                  updatedAt: now.toISOString(),
                  userInfo: { connect: { userID: userId } },
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
            sort: 'asc',
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
