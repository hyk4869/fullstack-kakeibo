import { MCompany, MHireDate, PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { MHireDateSampleData } from 'sampledata/types/MCategoryTypes';

const prisma = new PrismaClient();

const csvFilePath = path.resolve(__dirname, '../sampleCSV/MHireDate.csv');

const readCsvFile = async (filePath: string): Promise<MHireDateSampleData[]> => {
  return new Promise((resolve, reject) => {
    const content: MHireDateSampleData[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        content.push({
          sort: typeof row.sort === 'string' ? parseInt(row.sort, 10) : Number(row.sort),
          hireDate: typeof row.hireDate === 'string' ? new Date(row.hireDate) : null,
          retirementDate:
            row.retirementDate !== null
              ? typeof row.retirementDate === 'string'
                ? new Date(row.retirementDate)
                : null
              : null,
          userId: row.userId,
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

/** MHiredateのテストデータ */
export const createMHireDateSeedData = async (): Promise<MHireDate[]> => {
  const csvData = await readCsvFile(csvFilePath);
  const posts = [];

  for (const data of csvData) {
    const { sort, companyId, hireDate, retirementDate, userId } = data;

    const verify = prisma.mCompany.findMany({
      where: {
        AND: [{ sort: sort }, { userId: userId }],
      },
    });
    const createPosts = prisma.mHireDate.create({
      data: {
        sort,
        companyId: (await verify).find((a) => a.sort === sort)?.id,
        hireDate,
        retirementDate: retirementDate ?? null,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    posts.push(createPosts);
  }
  return await prisma.$transaction(posts);
};
