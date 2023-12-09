/** 月の出費 */
export interface TMonthlySpending {
  /** id番号 */
  id: number | null;
  /** ユーザーID */
  userId: number | null;
  /** 利用日 */
  paymentDay: Date | null;
  /** 利用店 */
  store: string | null;
  /** カテゴリーID */
  categoryId: number | null;
  /** 利用金額 */
  usageFee: number | null;
  /** カテゴリーの詳細 */
  category?: MCategory | null;
}

/** カテゴリー */
export interface MCategory {
  /** カテゴリーID */
  categoryId: number | null;
  /** カテゴリー名 */
  categoryName: string | null;
  /** ユーザーID */
  userId: number | null;
}

/** 会社 */
export interface MCompany {
  /** id番号 */
  id: number | null;
  /** 会社名 */
  name: string | null;
  /** 大分類 */
  majorSector: string | null;
  /** ユーザーID */
  userId: number | null;
}

/** 入退社日 */
export interface MHireDate {
  /** id番号 */
  id: number | null;
  /** 会社ID */
  companyId: number | null;
  /** 入社日 */
  hireDate: Date | null;
  /** 退職日 */
  retirementDate: Date | null;
  /** ユーザーID */
  userId: number | null;
}

export interface TSalaryTax {
  /** id番号 */
  id: number;
  /** ユーザーID */
  userId: number;
  /** 会社ID */
  companyId: number;
  /** 健康保険料 */
  healthInsuranceExpense: number;
  /** 厚生年金保険料 */
  employeePensionInsuranceExpense: number;
  /** 国民年金保険料 */
  nationalPensionInsuranceExpense: number;
  /** 雇用保険料 */
  employeeInsuranceExpense: number;
  /** 介護保険料 */
  longTermCareInsurance: number;
  /** 所得税 */
  incomeTax: number;
  /** 住民税 */
  residenceTax: number;
  /** 年末調整額 */
  yearEndAdjustment: number;
  /** その他 */
  notes: number;
}
