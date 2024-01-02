import { Injectable } from '@nestjs/common';
import { TBonus, TSalary, TTax, TTaxBonus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SalaryInfoService {
  constructor(private prisma: PrismaService) {}

  async getSalaryTax(): Promise<TTax[]> {
    const result = await this.prisma.tTax.findMany({
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
          const getExistingRecords = await prisma.tTax.findUnique({
            where: {
              id: data.id,
            },
          });
          if (getExistingRecords) {
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
            await prisma.tTax.create({
              data: {
                ...data,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
              },
            });
          }
        });
        await Promise.all(updateValue);

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

  async getSalary(): Promise<TSalary[]> {
    const result = await this.prisma.tSalary.findMany({
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
          const getExistingRecords = await prisma.tSalary.findUnique({
            where: {
              id: data.id,
            },
          });

          if (getExistingRecords) {
            await prisma.tSalary.update({
              where: {
                id: data.id,
              },
              data: {
                ...data,
                updatedAt: now.toISOString(),
              },
            });
          } else {
            await prisma.tSalary.create({
              data: {
                ...data,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
              },
            });
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

  async getBonusTax(): Promise<TTaxBonus[]> {
    const result = await this.prisma.tTaxBonus.findMany({
      include: { TBonus: true },
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }

  async getBonus(): Promise<TBonus[]> {
    const result = await this.prisma.tBonus.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return result;
  }
}
