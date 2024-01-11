/** 毎月の出費ヘッダー */
export const monthlySpendingHeaders = [
  { label: 'sort', key: 'sort' },
  { label: 'userId', key: 'userId' },
  { label: 'paymentDay', key: 'paymentDay' },
  { label: 'store', key: 'store' },
  { label: 'categorySort', key: 'categorySort' },
  { label: 'usageFee', key: 'usageFee' },
];

/** カテゴリーマスタ用 */
export const categoryHeaders = [
  { label: 'sort', key: 'sort' },
  { label: 'userId', key: 'userId' },
  { label: 'categoryName', key: 'categoryName' },
];

/** 会社マスタ用 */
export const companyHeaders = [
  { label: 'sort', key: 'sort' },
  { label: 'userId', key: 'userId' },
  { label: 'name', key: 'name' },
  { label: 'companyNum', key: 'companyNum' },
  { label: 'majorSector', key: 'majorSector' },
];

/** 入退社マスタ用 */
export const hireDateHeaders = [
  { label: 'sort', key: 'sort' },
  { label: 'userId', key: 'userId' },
  { label: 'companyNum', key: 'companyNum' },
  { label: 'hireDate', key: 'hireDate' },
  { label: 'retirementDate', key: 'retirementDate' },
];

/** 給与ヘッダー */
export const salaryHeaders = [
  { label: 'sort', key: 'sort' },
  { label: 'userId', key: 'userId' },
  { label: 'payday', key: 'payday' },
  { label: 'salary', key: 'salary' },
  { label: 'companyNum', key: 'companyNum' },
];

/** 給与に対する税金ヘッダー */
export const salaryTaxHeaders = [
  { label: 'sort', key: 'sort' },
  { label: 'userId', key: 'userId' },
  { label: 'companyNum', key: 'companyNum' },
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

/** 賞与ヘッダー */
export const bonusHeaders = [
  { label: 'sort', key: 'sort' },
  { label: 'userId', key: 'userId' },
  { label: 'payday', key: 'payday' },
  { label: 'bonusAmount', key: 'bonusAmount' },
  { label: 'companyNum', key: 'companyNum' },
];

/** 賞与に対する税金ヘッダー */
export const bonusTaxHeaders = [
  { label: 'sort', key: 'sort' },
  { label: 'userId', key: 'userId' },
  { label: 'companyNum', key: 'companyNum' },
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
