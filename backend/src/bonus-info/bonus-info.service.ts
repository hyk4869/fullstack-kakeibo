import { Injectable } from '@nestjs/common';
import { MCompany, TBonus, TSalary, TTaxBonus } from '@prisma/client';
import { isEqual } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilFunctions } from 'src/util/utils';

@Injectable()
export class BonusInfoService {
  constructor(private prisma: PrismaService) {}

  private util = new UtilFunctions(this.prisma);

  async getBonusTax(userID: string): Promise<TTaxBonus[]> {
    const result = await this.prisma.tTaxBonus.findMany({
      where: {
        userId: userID,
      },
      include: {
        TBonus: true,
      },
      orderBy: {
        sort: 'asc',
      },
    });
    return result;
  }

  /**
   * TTaxBonusの保存作業
   * @param postData
   * @returns
   */
  async postBonusTaxContent(postData: TTaxBonus[]): Promise<TTaxBonus[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }

    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();

        const updateValue = postData.map(async ({ companyId, userId, ...data }) => {
          /** MCompany */
          const mCompany = await this.util.getFindManyData<MCompany>(
            { companyNum: data.companyNum, userId: userId },
            this.util.mCompany,
          );

          /** TTaxBonus */
          const tTaxBonus = await this.util.getFindManyData<TTaxBonus>(
            { companyNum: data.companyNum, userId: userId },
            this.util.tTaxBonus,
          );

          if (data.id) {
            const { createdAt, updatedAt, ...restData } = data;
            const compare = tTaxBonus.some(({ companyId, userId, createdAt, updatedAt, ...a }) => isEqual(a, restData));
            // 値が変わっていないものは早期return
            if (compare) return;

            await prisma.tTaxBonus.update({
              where: {
                id: data.id,
              },
              data: {
                ...data,
                updatedAt: now.toISOString(),
                MCompany: { connect: { id: mCompany.find((a) => a.companyNum === data.companyNum)?.id } },
                userInfo: { connect: { userID: userId } },
              },
            });
          } else {
            const foundMatchingSort = tTaxBonus.some((s) => s.sort === data.sort);

            if (foundMatchingSort) {
              return;
            } else {
              const { id, ...datas } = data;

              // 既存のレコードがない場合は新規作成
              await prisma.tTaxBonus.create({
                data: {
                  ...datas,
                  createdAt: now.toISOString(),
                  updatedAt: now.toISOString(),
                  userInfo: { connect: { userID: userId } },
                  MCompany: { connect: { id: mCompany.find((a) => a.companyNum === data.companyNum)?.id } },
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
   * TBonusの保存作業
   * @param postData
   * @returns
   */
  async postBonusContent(postData: TBonus[]): Promise<TBonus[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }

    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();

        const updateValue = postData.map(async ({ companyId, userId, ...data }) => {
          /** MCompany */
          const mCompany = await this.util.getFindManyData<MCompany>(
            { companyNum: data.companyNum, userId: userId },
            this.util.mCompany,
          );

          /** TTaxBonus */
          const tTaxBonus = await this.util.getFindManyData<TTaxBonus>(
            { companyNum: data.companyNum, userId: userId },
            this.util.tTaxBonus,
          );

          /** TBonus */
          const tBonus = await this.util.getFindManyData<TBonus>(
            { companyNum: data.companyNum, userId: userId },
            this.util.tBonus,
          );

          if (data.id) {
            const { createdAt, updatedAt, ...restData } = data;
            const compare = tBonus.some(({ companyId, userId, createdAt, updatedAt, ...a }) => isEqual(a, restData));
            // 値が変わっていないものは早期return
            if (compare) return;

            const { id, ...datas } = data;
            await prisma.tBonus.update({
              where: {
                id: data.id,
              },
              data: {
                ...datas,
                updatedAt: now.toISOString(),
                payday: new Date(data.payday).toISOString(),
                userInfo: { connect: { userID: userId } },
                MCompany: { connect: { id: mCompany.find((a) => a.companyNum === data.companyNum)?.id } },
                TTaxBonus: { connect: { id: tTaxBonus.find((a) => a.sort === data.sort)?.id } },
              },
            });
          } else {
            const foundMatchingSort = tBonus.some((s) => s.sort === data.sort);

            if (foundMatchingSort) {
              return;
            } else {
              const { id, ...datas } = data;

              // 既存のレコードがない場合は新規作成
              await prisma.tBonus.create({
                data: {
                  ...datas,
                  createdAt: now.toISOString(),
                  updatedAt: now.toISOString(),
                  userInfo: { connect: { userID: userId } },
                  MCompany: { connect: { id: mCompany.find((a) => a.companyNum === data.companyNum)?.id } },
                  TTaxBonus: { connect: { id: tTaxBonus.find((a) => a.sort === data.sort)?.id } },
                },
              });
            }
          }
        });
        await Promise.all(updateValue);

        const userData = postData.find((a) => a.userId)?.userId;

        const latestData = await prisma.tBonus.findMany({
          where: {
            userId: userData,
          },
          include: {
            MCompany: true,
            TTaxBonus: true,
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

  async getBonus(userID: string): Promise<TBonus[]> {
    const result = await this.prisma.tBonus.findMany({
      where: {
        userId: userID,
      },
      orderBy: {
        sort: 'asc',
      },
    });
    return result;
  }
}
