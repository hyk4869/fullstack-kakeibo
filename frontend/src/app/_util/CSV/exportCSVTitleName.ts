/** 毎月の出費ヘッダー */
export const monthlySpendingHeaders = [
  { label: 'id', key: 'id' },
  { label: 'paymentDay', key: 'paymentDay' },
  { label: 'store', key: 'store' },
  { label: 'categoryId', key: 'categoryId' },
  { label: 'usageFee', key: 'usageFee' },
];

/** カテゴリーマスタ用 */
export const categoryHeaders = [
  { label: 'categoryId', key: 'categoryId' },
  { label: 'categoryName', key: 'categoryName' },
];

/** 会社マスタ用 */
export const companyHeaders = [
  { label: 'id', key: 'id' },
  { label: 'name', key: 'name' },
  { label: 'majorSector', key: 'majorSector' },
];

/** 入退社マスタ用 */
export const hireDateHeaders = [
  { label: 'id', key: 'id' },
  { label: 'companyId', key: 'companyId' },
  { label: 'hireDate', key: 'hireDate' },
  { label: 'retirementDate', key: 'retirementDate' },
];

/** 給与ヘッダー */
export const salaryHeaders = [
  { label: 'id', key: 'id' },
  { label: 'companyId', key: 'companyId' },
  { label: 'payday', key: 'payday' },
  { label: 'salary', key: 'salary' },
];

/** 給与に対する税金ヘッダー */
export const salaryTaxHeaders = [
  { label: 'id', key: 'id' },
  { label: 'userId', key: 'userId' },
  { label: 'companyId', key: 'companyId' },
  { label: 'healthInsuranceExpense', key: 'healthInsuranceExpense' },
  { label: 'employeePensionInsuranceExpense', key: 'employeePensionInsuranceExpense' },
  { label: 'nationalPensionInsuranceExpense', key: 'nationalPensionInsuranceExpense' },
  { label: 'employeeInsuranceExpense', key: 'employeeInsuranceExpense' },
  { label: 'longTermCareInsurance', key: 'longTermCareInsurance' },
  { label: 'incomeTax', key: 'incomeTax' },
  { label: 'residenceTax', key: 'residenceTax' },
  { label: 'yearEndAdjustment', key: 'yearEndAdjustment' },
  { label: 'notes', key: 'notes' },
];
