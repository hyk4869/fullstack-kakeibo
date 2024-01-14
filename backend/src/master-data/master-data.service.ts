import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MasterData } from './interface/masterDataInterface';
import { MCategory, MCompany, MHireDate } from '@prisma/client';

@Injectable()
export class MasterDataService {
  constructor(private prisma: PrismaService) {}

  /** ログイン時にマスターのデータを取ってくる処理 */
  public async getMasterData(userID: string): Promise<MasterData> {
    const result: MasterData = await this.findCategoryMaster(userID);
    return result;
  }

  private async findCategoryMaster(userID: string): Promise<MasterData> {
    const categoryData = await this.findData<MCategory>('mCategory', userID);
    const companyData = await this.findData<MCompany>('mCompany', userID);
    const hireDateData = await this.findData<MHireDate>('mHireDate', userID);

    const result: MasterData = {
      categoryData: categoryData,
      companyData: companyData,
      hireData: hireDateData,
    };
    return result;
  }

  /** ジェネリクスで書いた共通の処理 */
  private async findData<T>(key: string, id: string): Promise<T[]> {
    try {
      const result: T[] = await this.prisma[key].findMany({
        where: {
          userId: id,
        },
        orderBy: {
          sort: 'asc',
        },
      });
      return result;
    } catch (error) {
      throw new Error('データの取得中にエラーが発生しました。');
    }
  }
}
