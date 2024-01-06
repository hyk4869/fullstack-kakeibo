/** 月の出費 */
export interface TMonthlySpendingSampleData {
  /** id番号 */
  id?: string | null;
  /** sort番号 */
  sort?: number | null;
  /** ユーザーID */
  userId?: number | null;
  /** 利用日 */
  paymentDay?: Date | null;
  /** 利用店 */
  store?: string | null;
  /** カテゴリーID */
  categoryId?: number | null;
  /** 利用金額 */
  usageFee?: number | null;
  /** カテゴリーの詳細 */
  category?: MCategorySampleData | null;
}

/** カテゴリー */
export interface MCategorySampleData {
  /** sort番号 */
  sort?: number | null;
  /** カテゴリー名 */
  categoryName?: string | null;
  /** ユーザーID */
  userId?: string | null;
}

/** 会社 */
export interface MCompanySampleData {
  /** sort番号 */
  sort?: number | null;
  /** 会社名 */
  name?: string | null;
  /** 大分類 */
  majorSector?: string | null;
  /** 中分類 */
  subSector?: string | null;
  /** 小分類 */
  industry?: string | null;
  /** ユーザーID */
  userId?: string | null;
}

/** 入退社日 */
export interface MHireDateSampleData {
  /** sort番号 */
  sort?: number | null;
  /** 会社ID */
  companyId?: string | null;
  /** 入社日 */
  hireDate?: Date | null;
  /** 退職日 */
  retirementDate?: Date | null;
  /** ユーザーID */
  userId?: string | null;
}

/** 給与 */
export interface TSalarySampleData {
  /** id番号 */
  id?: string | null;
  /** sort番号 */
  sort?: number | null;
  /** ユーザーID */
  userId?: number | null;
  /** 支給日 */
  payday?: Date | null;
  /** 給与 */
  salary?: number | null;
  /** 会社ID */
  companyId?: number | null;
}

/** 給与に対する税金 */
export interface TSalaryTaxSampleData {
  /** id番号 */
  id?: string | null;
  /** sort番号 */
  sort?: number | null;
  /** ユーザーID */
  userId?: number | null;
  /** 会社ID */
  companyId?: number | null;
  /** 健康保険料 */
  healthInsuranceExpense?: number | null;
  /** 厚生年金保険料 */
  employeePensionInsuranceExpense?: number | null;
  /** 国民年金保険料 */
  nationalPensionInsuranceExpense?: number | null;
  /** 雇用保険料 */
  employeeInsuranceExpense?: number | null;
  /** 介護保険料 */
  longTermCareInsurance?: number | null;
  /** 所得税 */
  incomeTax?: number | null;
  /** 住民税 */
  residenceTax?: number | null;
  /** 年末調整額 */
  yearEndAdjustment?: number | null;
  /** その他 */
  notes?: number | null;
  /** 給与額 */
  TSalary?: TSalarySampleData[];
}

/** 賞与 */
export interface TBonusSampleData {
  /** id番号 */
  id?: string | null;
  /** sort番号 */
  sort?: number | null;
  /** ユーザーID */
  userId?: number | null;
  /** 支給日 */
  payday?: Date | null;
  /** 給与 */
  bonusAmount?: number | null;
  /** 会社ID */
  companyId?: number | null;
}

/** 賞与に対する税金 */
export interface TBonusTaxSampleData {
  /** id番号 */
  id?: string | null;
  /** sort番号 */
  sort?: number | null;
  /** ユーザーID */
  userId?: number | null;
  /** 会社ID */
  companyId?: number | null;
  /** 健康保険料 */
  healthInsuranceExpense?: number | null;
  /** 厚生年金保険料 */
  employeePensionInsuranceExpense?: number | null;
  /** 国民年金保険料 */
  nationalPensionInsuranceExpense?: number | null;
  /** 雇用保険料 */
  employeeInsuranceExpense?: number | null;
  /** 介護保険料 */
  longTermCareInsurance?: number | null;
  /** 所得税 */
  incomeTax?: number | null;
  /** 住民税 */
  residenceTax?: number | null;
  /** 年末調整額 */
  yearEndAdjustment?: number | null;
  /** その他 */
  notes?: number | null;
  /** ボーナス額 */
  TBonus?: TBonusSampleData[];
}
