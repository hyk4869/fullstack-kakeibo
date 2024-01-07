import { PrismaClient } from '@prisma/client';
import { createUserSeedData } from '../sampledata/sampleScript/user.seedData';
import { createMCategorySeedData } from '../sampledata/sampleScript/MCategory.seedData';
import { createMCompanySeedData } from '../sampledata/sampleScript/MCompany.seedData';
import { createMHireDateSeedData } from '../sampledata/sampleScript/MHireDate.seedData';
import { createTMonthlySpendingSeedData } from '../sampledata/sampleScript/TMonthlySpending.seedData';

const prisma = new PrismaClient();

const main = async () => {
  console.log(`seed データの追加を開始します`);

  await createUserSeedData();
  await createMCategorySeedData();
  await createMCompanySeedData();
  await createMHireDateSeedData();
  await createTMonthlySpendingSeedData();

  console.log(`完了しました`);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
