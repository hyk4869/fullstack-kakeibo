import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateNewUser } from 'src/user/dto/createUser.input';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';

const prisma = new PrismaClient();

const csvFilePath = path.resolve(__dirname, '../sampleCSV/userData.csv');

const readCsvFile = async (filePath: string): Promise<CreateNewUser[]> => {
  return new Promise((resolve, reject) => {
    const users: CreateNewUser[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        users.push({
          userID: row.userID,
          email: row.email,
          password: row.password,
        });
      })
      .on('end', () => {
        resolve(users);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

/** User */
export const createUserSeedData = async (): Promise<User[]> => {
  const csvData = await readCsvFile(csvFilePath);

  const posts = [];

  for (const user of csvData) {
    const { userID, email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const checkDuplicate = await prisma.user.findMany({
      where: {
        OR: [{ email: email }, { userID: userID }],
      },
    });
    if (checkDuplicate.length === 0) {
      const createPosts = prisma.user.create({
        data: {
          userID,
          email,
          password: hashedPassword,
          lastLoginAt: new Date(),
        },
      });

      posts.push(createPosts);
    } else {
      throw new Error('nameもしくは、emailが重複している可能性があります');
    }
  }
  return await prisma.$transaction(posts);
};
