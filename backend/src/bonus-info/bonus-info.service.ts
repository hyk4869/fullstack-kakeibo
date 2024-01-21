import { Injectable } from '@nestjs/common';
import { TBonus, TSalary, TTaxBonus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BonusInfoService {
  constructor(private prisma: PrismaService) {}

  async getBonusTax(userID: string): Promise<TTaxBonus[]> {
    const result = await this.prisma.tTaxBonus.findMany({
      where: {
        userId: userID,
      },
      include: {
        TBonus: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }

  async postBonusTaxContent(postData: TTaxBonus[]): Promise<TTaxBonus[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }

    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();

        const updateValue = postData.map(async (data) => {
          if (data.id) {
            // 既存のレコードがある場合は更新
            await prisma.tTaxBonus.update({
              where: {
                id: data.id,
              },
              data: {
                ...data,
                updatedAt: now.toISOString(),
              },
            });
          } else {
            const verify = await prisma.mCompany.findMany({
              where: {
                AND: [{ companyNum: data.companyNum }, { userId: data.userId }],
              },
            });

            const checkSort = await prisma.tTaxBonus.findMany({
              where: {
                userId: data.userId,
              },
            });

            const foundMatchingSort = checkSort.some((s) => s.sort === data.sort);

            if (foundMatchingSort) {
              return;
            } else {
              const { userId, companyId, id, ...datas } = data;

              // 既存のレコードがない場合は新規作成
              await prisma.tTaxBonus.create({
                data: {
                  ...datas,
                  createdAt: now.toISOString(),
                  updatedAt: now.toISOString(),
                  userInfo: { connect: { userID: data.userId } },
                  MCompany: { connect: { id: verify.find((a) => a.companyNum === data.companyNum)?.id } },
                },
              });
            }
          }
        });
        await Promise.all(updateValue);

        const userData = postData.find((a) => a.userId)?.userId;

        /** データベースから最新のデータを取得 */
        const latestData = await prisma.tTaxBonus.findMany({
          where: {
            userId: userData,
          },
          include: {
            TBonus: true,
            MCompany: true,
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

  async deleteBonusTaxContent(postData: TTaxBonus[]): Promise<TTaxBonus[]> {
    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        /** DBにある全てのidを取得 */
        const getExistingRecords = await prisma.tTaxBonus.findMany({
          select: {
            id: true,
          },
          where: {
            userId: postData.find((a) => a.userId)?.userId,
          },
        });
        /** postDataに存在するidを取得 */
        const missingIds = getExistingRecords.filter((a) => postData.some((d) => d.id === a.id)).map((s) => s.id);
        if (missingIds.length > 0) {
          await prisma.tTaxBonus.deleteMany({
            where: {
              id: { in: missingIds },
            },
          });
        }
        const userData = postData.find((a) => a.userId)?.userId;

        const latestData = await prisma.tTaxBonus.findMany({
          where: {
            userId: userData,
          },
          include: {
            TBonus: true,
            MCompany: true,
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

  async postBonusContent(postData: TBonus[]): Promise<TBonus[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }
    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();

        const updateValue = postData.map(async (data) => {
          if (data.id) {
            // 既存のレコードがある場合は更新
            await prisma.tBonus.update({
              where: {
                id: data.id,
              },
              data: {
                ...data,
                updatedAt: now.toISOString(),
                payday: new Date(data.payday).toISOString(),
              },
            });
          } else {
            const verify = await prisma.mCompany.findMany({
              where: {
                AND: [{ sort: data.sort }, { userId: data.userId }],
              },
            });
            const verifyTTax = await prisma.tTaxBonus.findMany({
              where: {
                AND: [{ sort: data.sort }, { userId: data.userId }],
              },
            });
            const checkSort = await prisma.tBonus.findMany({
              where: {
                userId: data.userId,
              },
            });
            const foundMatchingSort = checkSort.some((s) => s.sort === data.sort);

            if (foundMatchingSort) {
              return;
            } else {
              const { userId, companyId, id, ...datas } = data;

              // 既存のレコードがない場合は新規作成
              await prisma.tBonus.create({
                data: {
                  ...datas,
                  createdAt: now.toISOString(),
                  updatedAt: now.toISOString(),
                  // payday: new Date(data.payday).toISOString(),
                  userInfo: { connect: { userID: data.userId } },
                  MCompany: { connect: { id: verify.find((a) => a.companyNum === data.companyNum)?.id } },
                  TTaxBonus: { connect: { id: verifyTTax.find((a) => a.sort === data.sort)?.id } },
                },
              });
            }
          }
        });
        await Promise.all(updateValue);

        const getLatestData = await prisma.tBonus.findMany({
          orderBy: {
            id: 'asc',
          },
        });

        return getLatestData;
      });

      return insertedData;
    } catch (error) {
      console.error('データベースへの書き込みエラー:', error);
      throw error;
    }
  }

  async deleteBonusContent(postData: TBonus[]): Promise<TBonus[]> {
    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        /** DBにある全てのidを取得 */
        const getExistingRecords = await prisma.tBonus.findMany({
          select: {
            id: true,
          },
          where: {
            userId: postData.find((a) => a.userId)?.userId,
          },
        });

        /** postDataに存在するidを取得 */
        const missingIds = getExistingRecords.filter((a) => postData.some((d) => d.id === a.id)).map((s) => s.id);
        if (missingIds.length > 0) {
          await prisma.tBonus.deleteMany({
            where: {
              id: {
                in: missingIds,
              },
            },
          });
        }
        const userData = postData.find((a) => a.userId)?.userId;

        /** データベースから最新のデータを取得 */
        const latestData = await prisma.tBonus.findMany({
          where: {
            userId: userData,
          },
          include: {
            MCompany: true,
            TTaxBonus: true,
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

  async getBonus(userID: string): Promise<TBonus[]> {
    const result = await this.prisma.tBonus.findMany({
      where: {
        userId: userID,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }
}
