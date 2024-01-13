import { MCategory, MCompany, MHireDate } from '@prisma/client';

export interface MasterData {
  categoryData?: MCategory[] | undefined;
  companyData?: MCompany[] | undefined;
  hireData?: MHireDate[] | undefined;
}
