import { PrismaClient, TBonus, TSalary } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { TSalarySampleData } from 'sampledata/types/MCategoryTypes';

const prisma = new PrismaClient();

const csvFilePath = path.resolve(__dirname, '../sampleCSV/TSalary.csv');

const readCsvFile = async (filePath: string): Promise<TSalarySampleData[]> => {
  return new Promise((resolve, reject) => {
    const content: TSalarySampleData[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        content.push({
          sort: typeof row.sort === 'string' ? parseInt(row.sort, 10) ?? null : Number(row.sort) ?? null,
          userId: row.userId,
          payday: typeof row.payday === 'string' ? new Date(row.payday) : null,
          salary: typeof row.salary === 'string' ? parseInt(row.salary, 10) ?? null : Number(row.salary) ?? null,
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

/** TSalaryのテストデータ */
export const createTSalarySeedData = async (): Promise<TSalary[]> => {
  const csvData = await readCsvFile(csvFilePath);
  const posts = [];

  for (const data of csvData) {
    const { sort, userId, payday, salary, companyNum } = data;

    const verifyTaxID = prisma.tTax.findMany({
      where: {
        AND: [{ sort: sort }, { userId: userId }],
      },
    });

    const verifyCompanyID = prisma.mCompany.findMany({
      where: {
        AND: [{ companyNum: companyNum }, { userId: userId }],
      },
    });

    const createPosts = prisma.tSalary.create({
      data: {
        sort,
        userInfo: { connect: { userID: userId } },
        payday,
        salary,
        companyNum,
        MCompany: { connect: { id: (await verifyCompanyID).find((a) => a.companyNum === companyNum)?.id } },
        TTax: { connect: { id: (await verifyTaxID).find((a) => a.sort === sort)?.id } },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    posts.push(createPosts);
  }
  return await prisma.$transaction(posts);
};
