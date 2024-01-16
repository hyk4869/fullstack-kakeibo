import { Injectable } from '@nestjs/common';
import { MCompany } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyInfoService {
  constructor(private prisma: PrismaService) {}

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

  async postCompanyContent(postData: MCompany[]): Promise<MCompany[]> {
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
            await prisma.mCompany.update({
              where: {
                id: data.id,
              },
              data: {
                ...data,
                updatedAt: now.toISOString(),
              },
            });
          } else {
            const verfiy = await prisma.mCompany.findMany({
              where: {
                AND: [{ sort: data.sort }, { userId: data.userId }],
              },
            });

            const foundMatchingSort = verfiy.some((s) => s.sort === data.sort);

            if (foundMatchingSort) {
              return;
            } else {
              const { userId, id, ...datas } = data;

              // 既存のレコードがない場合は新規作成
              await prisma.mCompany.create({
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
}
