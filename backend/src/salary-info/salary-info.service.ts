import { Injectable } from '@nestjs/common';
import { TBonus, TSalary, TTax, TTaxBonus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SalaryInfoService {
  constructor(private prisma: PrismaService) {}

  //TODO: もう少しコンパクトにまとめる

  async getSalaryTax(userID: string): Promise<TTax[]> {
    const result = await this.prisma.tTax.findMany({
      where: {
        userId: userID,
      },
      include: {
        TSalary: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }

  async postSalaryTaxContent(postData: TTax[]): Promise<TTax[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }

    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();

        const updateValue = postData.map(async (data) => {
          if (data.id) {
            // 既存のレコードがある場合は更新
            await prisma.tTax.update({
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

            const checkSort = await prisma.tTax.findMany({
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
              await prisma.tTax.create({
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
        const latestData = await prisma.tTax.findMany({
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

  async deleteSalaryTaxContent(postData: TTax[]): Promise<TTax[]> {
    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const getExistingRecords = await prisma.tTax.findMany({
          select: {
            id: true,
          },
        });
        const missingIds = getExistingRecords.filter((a) => postData.some((d) => d.id === a.id)).map((s) => s.id);
        if (missingIds.length > 0) {
          await prisma.tTax.deleteMany({
            where: {
              id: { in: missingIds },
            },
          });
        }
        const getLatestData = await prisma.tTax.findMany({
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

  async getSalary(userID: string): Promise<TSalary[]> {
    const result = await this.prisma.tSalary.findMany({
      where: {
        userId: userID,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }

  async postSalaryContent(postData: TSalary[]): Promise<TSalary[]> {
    if (!Array.isArray(postData)) {
      throw new Error('postData must be an array');
    }
    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const now = new Date();

        const updateValue = postData.map(async (data) => {
          if (data.id) {
            // 既存のレコードがある場合は更新
            await prisma.tSalary.update({
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
            const verifyTTax = await prisma.tTax.findMany({
              where: {
                AND: [{ sort: data.sort }, { userId: data.userId }],
              },
            });
            const checkSort = await prisma.tSalary.findMany({
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
              await prisma.tSalary.create({
                data: {
                  ...datas,
                  createdAt: now.toISOString(),
                  updatedAt: now.toISOString(),
                  // payday: new Date(data.payday).toISOString(),
                  userInfo: { connect: { userID: data.userId } },
                  MCompany: { connect: { id: verify.find((a) => a.companyNum === data.companyNum)?.id } },
                  TTax: { connect: { id: verifyTTax.find((a) => a.sort === data.sort)?.id } },
                },
              });
            }
          }
        });
        await Promise.all(updateValue);

        const getLatestData = await prisma.tSalary.findMany({
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

  async deleteSalaryContent(postData: TSalary[]): Promise<TSalary[]> {
    try {
      const insertedData = await this.prisma.$transaction(async (prisma) => {
        const getExistingRecords = await prisma.tSalary.findMany({
          select: {
            id: true,
          },
        });
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
        const getLatestData = await prisma.tSalary.findMany({
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
}
