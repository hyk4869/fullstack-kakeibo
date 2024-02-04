import { Injectable } from '@nestjs/common';
import { MCompany, TSalary, TTax } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilFunctions } from 'src/util/utils';
import { isEqual } from 'lodash';

@Injectable()
export class SalaryInfoService {
  constructor(private prisma: PrismaService) {}

  private util = new UtilFunctions(this.prisma);

  //TODO: もう少しコンパクトにまとめる

  async getSalaryTax(userID: string): Promise<TTax[]> {
    const result = await this.prisma.tTax.findMany({
      where: {
        userId: userID,
      },
      include: {
        TSalary: true,
        MCompany: true,
      },
      orderBy: {
        sort: 'asc',
      },
    });
    return result;
  }

  /**
   * TTaxの保存作業
   * @param postData
   * @returns
   */
  async postSalaryTaxContent(postData: TTax[]): Promise<TTax[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }

    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();

        const updateValue = postData.map(async ({ userId, companyId, ...data }) => {
          /** MCompany */
          const mCompany = await this.util.getFindManyData<MCompany>(
            { companyNum: data.companyNum, userId: userId },
            this.util.mCompany,
          );
          /** TTax */
          const tTax = await this.util.getFindManyData<TTax>({ userId: userId }, this.util.tTax);

          if (data.id) {
            const { createdAt, updatedAt, ...restData } = data;
            const compare = tTax.some(({ companyId, userId, createdAt, updatedAt, ...a }) => isEqual(a, restData));
            // 値が変わっていないものは早期return
            if (compare) return;

            await prisma.tTax.update({
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
            const foundMatchingSort = tTax.some((s) => s.sort === data.sort);

            if (foundMatchingSort) {
              return;
            } else {
              const { id, ...datas } = data;

              // 既存のレコードがない場合は新規作成
              await prisma.tTax.create({
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
        const latestData = await prisma.tTax.findMany({
          where: {
            userId: userData,
          },
          include: {
            TSalary: true,
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

  async deleteSalaryTaxContent(postData: TTax[]): Promise<TTax[]> {
    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        /** DBにある全てのidを取得 */
        const getExistingRecords = await prisma.tTax.findMany({
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
          await prisma.tTax.deleteMany({
            where: {
              id: { in: missingIds },
            },
          });
        }
        const userData = postData.find((a) => a.userId)?.userId;

        const latestData = await prisma.tTax.findMany({
          where: {
            userId: userData,
          },
          include: {
            TSalary: true,
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

  async getSalary(userID: string): Promise<TSalary[]> {
    const result = await this.prisma.tSalary.findMany({
      where: {
        userId: userID,
      },
      include: {
        MCompany: true,
        TTax: true,
      },
      orderBy: {
        sort: 'asc',
      },
    });
    return result;
  }

  /**
   * TSalaryの保存作業
   * @param postData
   * @returns
   */
  async postSalaryContent(postData: TSalary[]): Promise<TSalary[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }
    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();

        const updateValue = postData.map(async ({ userId, companyId, ...data }) => {
          /** MCompany */
          const mCompany = await this.util.getFindManyData<MCompany>(
            { companyNum: data.companyNum, userId: userId },
            this.util.mCompany,
          );
          /** TTax */
          const tTax = await this.util.getFindManyData<TTax>({ userId: userId }, this.util.tTax);
          /** tSalary */
          const tSalary = await this.util.getFindManyData<TSalary>({ userId: userId }, this.util.tSalary);

          if (data.id) {
            const { createdAt, updatedAt, ...restData } = data;
            const compare = tSalary.some(({ companyId, userId, createdAt, updatedAt, ...a }) => isEqual(a, restData));
            // 値が変わっていないものは早期return
            if (compare) return;
            // 仕方なくこっちを使う
            const { id, ...dataWithoutId } = data;

            await prisma.tSalary.update({
              where: {
                id: data.id,
              },
              data: {
                ...dataWithoutId,
                updatedAt: now.toISOString(),
                payday: new Date(data.payday).toISOString(),
                userInfo: { connect: { userID: userId } },
                MCompany: { connect: { id: mCompany.find((a) => a.companyNum === data.companyNum)?.id } },
                TTax: { connect: { id: tTax.find((a) => a.sort === data.sort)?.id } },
              },
            });
          } else {
            const foundMatchingSort = tSalary.some((s) => s.sort === data.sort);

            if (foundMatchingSort) {
              return;
            } else {
              const { id, ...datas } = data;

              // 既存のレコードがない場合は新規作成
              await prisma.tSalary.create({
                data: {
                  ...datas,
                  createdAt: now.toISOString(),
                  updatedAt: now.toISOString(),
                  userInfo: { connect: { userID: userId } },
                  MCompany: { connect: { id: mCompany.find((a) => a.companyNum === data.companyNum)?.id } },
                  TTax: { connect: { id: tTax.find((a) => a.sort === data.sort)?.id } },
                },
              });
            }
          }
        });
        await Promise.all(updateValue);

        const userData = postData.find((a) => a.userId)?.userId;

        const latestData = await prisma.tSalary.findMany({
          where: {
            userId: userData,
          },
          include: {
            TTax: true,
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

  async deleteSalaryContent(postData: TSalary[]): Promise<TSalary[]> {
    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        /** DBにある全てのidを取得 */
        const getExistingRecords = await prisma.tSalary.findMany({
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
          await prisma.tSalary.deleteMany({
            where: {
              id: {
                in: missingIds,
              },
            },
          });
        }
        const userData = postData.find((a) => a.userId)?.userId;

        /** データベースから最新のデータを取得 */
        const latestData = await prisma.tSalary.findMany({
          where: {
            userId: userData,
          },
          include: {
            MCompany: true,
            TTax: true,
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
}
