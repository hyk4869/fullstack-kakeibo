import { MCompany, PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { MCompanySampleData } from 'sampledata/types/MCategoryTypes';

const prisma = new PrismaClient();

const csvFilePath = path.resolve(__dirname, '../sampleCSV/MCompany.csv');

const readCsvFile = async (filePath: string): Promise<MCompanySampleData[]> => {
  return new Promise((resolve, reject) => {
    const content: MCompanySampleData[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        content.push({
          sort: typeof row.sort === 'string' ? parseInt(row.sort, 10) ?? null : Number(row.sort) ?? null,
          name: row.name,
          majorSector: row.majorSector,
          subSector: row.subSector,
          industry: row.industry,
          userId: row.userId,
          companyNum:
            typeof row.companyNum === 'string' ? parseInt(row.companyNum, 10) ?? null : Number(row.companyNum) ?? null,
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

/** MCompanyのテストデータ */
export const createMCompanySeedData = async (): Promise<MCompany[]> => {
  const csvData = await readCsvFile(csvFilePath);
  const posts = [];

  for (const data of csvData) {
    const { sort, name, majorSector, subSector, industry, userId, companyNum } = data;

    const createPosts = prisma.mCompany.create({
      data: {
        sort,
        name,
        majorSector,
        subSector,
        industry,
        userId,
        companyNum,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    posts.push(createPosts);
  }
  return await prisma.$transaction(posts);
};
