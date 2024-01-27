import { TBonus, TSalary, TTax, TTaxBonus } from '@prisma/client';

export interface AllIncomeData {
  salaryData?: TSalary[] | undefined;
  salaryTaxData?: TTax[] | undefined;
  bonusData?: TBonus[] | undefined;
  bonusTaxData?: TTaxBonus[] | undefined;
}
