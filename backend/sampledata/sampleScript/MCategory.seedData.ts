import { MCategory, PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { MCategorySampleData } from 'sampledata/types/MCategoryTypes';

const prisma = new PrismaClient();

const csvFilePath = path.resolve(__dirname, '../sampleCSV/MCategory.csv');

const readCsvFile = async (filePath: string): Promise<MCategorySampleData[]> => {
  return new Promise((resolve, reject) => {
    const content: MCategorySampleData[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        content.push({
          sort: typeof row.sort === 'string' ? parseInt(row.sort, 10) ?? null : Number(row.sort) ?? null,
          userId: row.userId,
          categoryName: row.categoryName,
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

/** MCategoryのテストデータ */
export const createMCategorySeedData = async (): Promise<MCategory[]> => {
  const csvData = await readCsvFile(csvFilePath);
  const posts = [];

  for (const data of csvData) {
    const { sort, userId, categoryName } = data;

    const createPosts = prisma.mCategory.create({
      data: {
        sort,
        userId,
        categoryName,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    posts.push(createPosts);
  }
  return await prisma.$transaction(posts);
};
