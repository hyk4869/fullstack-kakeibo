import { Injectable } from '@nestjs/common';
import { MCompany, MHireDate } from '@prisma/client';
import { isEqual } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilFunctions } from 'src/util/utils';

@Injectable()
export class CompanyInfoService {
  constructor(private prisma: PrismaService) {}

  private util = new UtilFunctions(this.prisma);

  /**
   * MCompanyの保存作業
   * @param postData
   * @returns
   */
  async postCompanyContent(postData: MCompany[]): Promise<MCompany[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }
    try {
      /** トランザクション処理 */
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();

        const upsertPromises = postData.map(async ({ userId, ...data }) => {
          /** mCompany */
          const mCompany = await this.util.getFindManyData<MCompany>(
            { sort: data.sort, userId: userId },
            this.util.mCompany,
          );

          if (data.id) {
            const { createdAt, updatedAt, ...restData } = data;
            const compare = mCompany.some(({ createdAt, updatedAt, userId, ...a }) => isEqual(a, restData));
            // 値が変わっていないものは早期return
            if (compare) return;

            await prisma.mCompany.update({
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
            const foundMatchingSort = mCompany.some((s) => s.sort === data.sort);

            if (foundMatchingSort) {
              return;
            } else {
              const { id, ...datas } = data;

              // 既存のレコードがない場合は新規作成
              await prisma.mCompany.create({
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
        const latestData = await prisma.mCompany.findMany({
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
      throw error;
    }
  }

  /**
   * MHireDateの保存作業
   * @param postData
   * @returns
   */
  async postHireDataContent(postData: MHireDate[]): Promise<MHireDate[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }
    try {
      /** トランザクション処理 */
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();

        const upsertPromises = postData.map(async ({ companyId, userId, ...data }) => {
          /** MHireDate */
          const mHireDate = await this.util.getFindManyData<MHireDate>(
            { sort: data.sort, userId: userId },
            this.util.mHireDate,
          );
          /** MCompany */
          const mCompany = await this.util.getFindManyData<MCompany>(
            { sort: data.sort, userId: userId },
            this.util.mCompany,
          );

          if (data.id) {
            const { createdAt, updatedAt, ...restData } = data;
            const compare = mHireDate.some(({ createdAt, updatedAt, userId, companyId, ...a }) => isEqual(a, restData));
            // 値が変わっていないものは早期return
            if (compare) return;
            await prisma.mHireDate.update({
              where: {
                id: data.id,
              },
              data: {
                ...data,
                updatedAt: now.toISOString(),
                userInfo: { connect: { userID: userId } },
                MCompany: { connect: { id: mCompany.find((s) => s.companyNum === data.companyNum)?.id } },
              },
            });
          } else {
            const foundMatchingSort = mHireDate.some((s) => s.sort === data.sort);

            if (foundMatchingSort) {
              return;
            } else {
              const { id, ...datas } = data;

              // 既存のレコードがない場合は新規作成
              await prisma.mHireDate.create({
                data: {
                  ...datas,
                  hireDate: new Date(data.hireDate),
                  retirementDate: data.retirementDate !== null ? new Date(data.retirementDate) : null,
                  createdAt: now.toISOString(),
                  updatedAt: now.toISOString(),
                  MCompany: { connect: { id: mCompany.find((s) => s.companyNum === data.companyNum)?.id } },
                  userInfo: { connect: { userID: userId } },
                },
              });
            }
          }
        });

        await Promise.all(upsertPromises);
        const userData = postData.find((a) => a.userId)?.userId;

        /** データベースから最新のデータを取得 */
        const latestData = await prisma.mHireDate.findMany({
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
      throw error;
    }
  }
}
