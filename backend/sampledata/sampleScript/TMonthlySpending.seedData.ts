import { PrismaClient, TMonthlySpending } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { TMonthlySpendingSampleData } from 'sampledata/types/MCategoryTypes';

const prisma = new PrismaClient();

const csvFilePath = path.resolve(__dirname, '../sampleCSV/TMonthlySpending.csv');

const readCsvFile = async (filePath: string): Promise<TMonthlySpendingSampleData[]> => {
  return new Promise((resolve, reject) => {
    const content: TMonthlySpendingSampleData[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        content.push({
          sort: typeof row.sort === 'string' ? parseInt(row.sort, 10) ?? null : Number(row.sort) ?? null,
          userId: row.userId,
          paymentDay: typeof row.paymentDay === 'string' ? new Date(row.paymentDay) : null,
          store: row.store,
          categorySort:
            typeof row.categorySort === 'string'
              ? parseInt(row.categorySort, 10) ?? null
              : Number(row.categorySort) ?? null,
          usageFee:
            typeof row.usageFee === 'string' ? parseInt(row.usageFee, 10) ?? null : Number(row.usageFee) ?? null,
        });
      })
      .on('end', () => {
        resolve(content);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

/** TMonthlySpendingのテストデータ */
export const createTMonthlySpendingSeedData = async (): Promise<TMonthlySpending[]> => {
  const csvData = await readCsvFile(csvFilePath);
  const posts = [];

  for (const data of csvData) {
    const { sort, userId, paymentDay, store, categorySort, usageFee, categoryId } = data;

    const verify = prisma.mCategory.findMany({
      where: {
        AND: [{ sort: categorySort }, { userId: userId }],
      },
    });

    const createPosts = prisma.tMonthlySpending.create({
      data: {
        sort,
        userInfo: { connect: { userID: userId } },
        paymentDay,
        store,
        categorySort,
        usageFee,
        category: { connect: { id: (await verify).find((a) => a.sort === categorySort)?.id } },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    posts.push(createPosts);
  }
  return await prisma.$transaction(posts);
};
