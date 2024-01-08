import { PrismaClient, TTaxBonus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { TBonusTaxSampleData } from 'sampledata/types/MCategoryTypes';

const prisma = new PrismaClient();

const csvFilePath = path.resolve(__dirname, '../sampleCSV/TTaxBonus.csv');

const readCsvFile = async (filePath: string): Promise<TBonusTaxSampleData[]> => {
  return new Promise((resolve, reject) => {
    const content: TBonusTaxSampleData[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        content.push({
          sort: typeof row.sort === 'string' ? parseInt(row.sort, 10) ?? null : Number(row.sort) ?? null,
          userId: row.userId,
          healthInsuranceExpense:
            typeof row.healthInsuranceExpense === 'string'
              ? parseInt(row.healthInsuranceExpense, 10) ?? null
              : Number(row.healthInsuranceExpense) ?? null,
          employeePensionInsuranceExpense:
            typeof row.employeePensionInsuranceExpense === 'string'
              ? parseInt(row.employeePensionInsuranceExpense, 10) ?? null
              : Number(row.employeePensionInsuranceExpense) ?? null,
          nationalPensionInsuranceExpense:
            typeof row.nationalPensionInsuranceExpense === 'string'
              ? parseInt(row.nationalPensionInsuranceExpense, 10) ?? null
              : Number(row.nationalPensionInsuranceExpense) ?? null,
          employeeInsuranceExpense:
            typeof row.employeeInsuranceExpense === 'string'
              ? parseInt(row.employeeInsuranceExpense, 10) ?? null
              : Number(row.employeeInsuranceExpense) ?? null,
          longTermCareInsurance:
            typeof row.longTermCareInsurance === 'string'
              ? parseInt(row.longTermCareInsurance, 10) ?? null
              : Number(row.longTermCareInsurance) ?? null,
          incomeTax:
            typeof row.incomeTax === 'string' ? parseInt(row.incomeTax, 10) ?? null : Number(row.incomeTax) ?? null,
          residenceTax:
            typeof row.residenceTax === 'string'
              ? parseInt(row.residenceTax, 10) ?? null
              : Number(row.residenceTax) ?? null,
          yearEndAdjustment:
            typeof row.yearEndAdjustment === 'string'
              ? parseInt(row.yearEndAdjustment, 10) ?? null
              : Number(row.yearEndAdjustment) ?? null,
          notes: typeof row.notes === 'string' ? parseInt(row.notes, 10) ?? null : Number(row.notes) ?? null,
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

/** TTaxBonusのテストデータ */
export const createTTaxBonusSeedData = async (): Promise<TTaxBonus[]> => {
  const csvData = await readCsvFile(csvFilePath);
  const posts = [];

  for (const data of csvData) {
    const {
      sort,
      userId,
      companyId,
      healthInsuranceExpense,
      employeePensionInsuranceExpense,
      nationalPensionInsuranceExpense,
      employeeInsuranceExpense,
      longTermCareInsurance,
      incomeTax,
      residenceTax,
      yearEndAdjustment,
      notes,
      companyNum,
    } = data;

    const verify = prisma.mCompany.findMany({
      where: {
        AND: [{ companyNum: companyNum }, { userId: userId }],
      },
    });

    const createPosts = prisma.tTaxBonus.create({
      data: {
        sort,
        userInfo: { connect: { userID: userId } },
        healthInsuranceExpense,
        employeePensionInsuranceExpense,
        nationalPensionInsuranceExpense,
        employeeInsuranceExpense,
        longTermCareInsurance,
        incomeTax,
        residenceTax,
        yearEndAdjustment,
        notes,
        companyNum,
        MCompany: { connect: { id: (await verify).find((a) => a.companyNum === companyNum)?.id } },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    posts.push(createPosts);
  }
  return await prisma.$transaction(posts);
};
