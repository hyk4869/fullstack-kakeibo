import { Injectable } from '@nestjs/common';
import { MCompany, MHireDate } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilFunctions } from 'src/util/utils';

@Injectable()
export class CompanyInfoService {
  constructor(private prisma: PrismaService) {}

  private util = new UtilFunctions(this.prisma);

  async getCompanyContent() {
    const result = await this.prisma.mCompany.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }
  async getHireDateContent() {
    const result = await this.prisma.mHireDate.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }

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
            // 既存のレコードがある場合は更新
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
            // 既存のレコードがある場合は更新
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
