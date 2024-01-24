import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

export class UtilFunctions {
  constructor(private readonly prisma: PrismaService) {}

  public mCompany: Prisma.MCompanyDelegate<DefaultArgs> = this.prisma.mCompany;
  public mCategory: Prisma.MCategoryDelegate<DefaultArgs> = this.prisma.mCategory;
  public mHireDate: Prisma.MHireDateDelegate<DefaultArgs> = this.prisma.mHireDate;
  public tBonus: Prisma.TBonusDelegate<DefaultArgs> = this.prisma.tBonus;
  public tTaxBonus: Prisma.TTaxBonusDelegate<DefaultArgs> = this.prisma.tTaxBonus;
  public tSalary: Prisma.TSalaryDelegate<DefaultArgs> = this.prisma.tSalary;
  public tTax: Prisma.TTaxDelegate<DefaultArgs> = this.prisma.tTax;
  public tMonthlySpending: Prisma.TMonthlySpendingDelegate<DefaultArgs> = this.prisma.tMonthlySpending;

  /**
   * findMany
   * @param filterCondition 条件➡こんな感じのオブジェクト　{ companyNum: 1, userId: 'test' }
   * @param model publicで定義しているモデル名
   * @returns
   */
  public async getFindManyData<T>(filterCondition: Record<string, any>, model): Promise<T[]> {
    /** AND条件に入るように処理。 */
    const whereConditions = Object.entries(filterCondition).map(([key, value]) => ({ [key]: value }));

    const result = await model.findMany({
      where: {
        AND: [...whereConditions],
      },
    });
    return result as T[];
  }
}
