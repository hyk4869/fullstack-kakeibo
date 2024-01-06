import { PrismaClient } from '@prisma/client';
import { createUserSeedData } from '../sampledata/sampleScript/user.seedData';

const prisma = new PrismaClient();

const main = async () => {
  console.log(`seed データの追加を開始します`);

  await createUserSeedData();

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
