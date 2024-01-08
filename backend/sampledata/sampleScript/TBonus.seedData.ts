import { PrismaClient, TBonus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { TBonusSampleData } from 'sampledata/types/MCategoryTypes';

const prisma = new PrismaClient();

const csvFilePath = path.resolve(__dirname, '../sampleCSV/TBonus.csv');

const readCsvFile = async (filePath: string): Promise<TBonusSampleData[]> => {
  return new Promise((resolve, reject) => {
    const content: TBonusSampleData[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        content.push({
          sort: typeof row.sort === 'string' ? parseInt(row.sort, 10) ?? null : Number(row.sort) ?? null,
          userId: row.userId,
          payday: typeof row.payday === 'string' ? new Date(row.payday) : null,
          bonusAmount:
            typeof row.bonusAmount === 'string'
              ? parseInt(row.bonusAmount, 10) ?? null
              : Number(row.bonusAmount) ?? null,
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

/** TBonusのテストデータ */
export const createTBonusSeedData = async (): Promise<TBonus[]> => {
  const csvData = await readCsvFile(csvFilePath);
  const posts = [];

  for (const data of csvData) {
    const { sort, userId, payday, bonusAmount, companyNum } = data;

    const verifyTaxBonusID = prisma.tTaxBonus.findMany({
      where: {
        AND: [{ sort: sort }, { userId: userId }],
      },
    });

    const verifyCompanyID = prisma.mCompany.findMany({
      where: {
        AND: [{ companyNum: companyNum }, { userId: userId }],
      },
    });

    const createPosts = prisma.tBonus.create({
      data: {
        sort,
        userInfo: { connect: { userID: userId } },
        payday,
        bonusAmount,
        companyNum,
        MCompany: { connect: { id: (await verifyCompanyID).find((a) => a.companyNum === companyNum)?.id } },
        TTaxBonus: { connect: { id: (await verifyTaxBonusID).find((a) => a.sort === sort)?.id } },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    posts.push(createPosts);
  }
  return await prisma.$transaction(posts);
};
