import { commonTableHeaderType } from './commonTableHeader';

/** カテゴリマスタのヘッダー */
export const categoryHeaderList: commonTableHeaderType[] = [
  {
    label: 'categoryId',
    id: 'categoryId',
  },
  {
    label: 'カテゴリー名',
    id: 'categoryName',
  },
  {
    label: '',
    id: '',
  },
];

/** カテゴリーマスタがどれだけ参照されているかのヘッダー */
export const numberOfCategoryHeaderList: commonTableHeaderType[] = [
  {
    label: 'categoryId',
    id: 'categoryId',
  },
  {
    label: 'カテゴリー名',
    id: 'categoryName',
  },
  {
    label: '参照されている数',
    id: 'amount',
  },
];

/** 入退社マスタのヘッダー */
export const hireDateHeaderList: commonTableHeaderType[] = [
  {
    id: 'sort',
    label: 'sort',
  },
  {
    id: 'companyId',
    label: '会社ID',
  },
  {
    id: 'hireDate',
    label: '入社日',
  },
  {
    id: 'retirementDate',
    label: '退職日',
  },
  {
    label: '',
    id: '',
  },
];

/** 各種集計カテゴリー別のヘッダー */
export const aggregationHeaderList: commonTableHeaderType[] = [
  {
    id: 'category',
    label: 'カテゴリー名',
  },
  {
    id: 'amount',
    label: '金額',
  },
];

/** 各種集計月間のヘッダー */
export const aggregationMonthlyHeaderList: commonTableHeaderType[] = [
  {
    id: 'date',
    label: '日付',
  },
  {
    id: 'amount',
    label: '金額',
  },
  // ...categoryData.map((a) => {
  //   return {
  //     id: a.categoryId !== undefined && a.categoryId !== null ? a.categoryId.toString() : String(a.categoryId),
  //     label: a.categoryName as string,
  //   };
  // }),
];

/** 各種集計月間のヘッダー */
export const aggregationAnnualSalaryHeaderList: commonTableHeaderType[] = [
  {
    id: 'year',
    label: '年',
  },
  {
    id: 'annualIncome',
    label: '年収',
  },
  {
    id: 'annualTax',
    label: '税金等',
  },
  {
    id: 'taxPercentage',
    label: '税率',
  },
  {
    id: 'disposableIncome',
    label: '可処分所得',
  },
];

/** 月間の支出ヘッダー */
export const monthlySpendingHeaderList: commonTableHeaderType[] = [
  {
    id: 'sort',
    label: 'sort',
  },
  {
    id: 'paymentDay',
    label: '利用日',
  },
  {
    id: 'store',
    label: '利用店',
  },
  {
    id: 'categoryId',
    label: 'カテゴリー',
  },
  {
    id: 'usageFee',
    label: '利用金額',
  },
  {
    id: '',
    label: '',
  },
];

/** 職歴マスタのヘッダー */
export const workExperienceHeaderList: commonTableHeaderType[] = [
  {
    id: 'sort',
    label: 'sort',
  },
  {
    id: 'companyNum',
    label: '会社番号',
  },
  {
    id: 'name',
    label: '会社名',
  },
  {
    id: 'majorSector',
    label: '大分類',
  },
  {
    label: '',
    id: '',
  },
];

/** 職歴マスタがどれだけ参照されているかのヘッダー */
export const numberOfWorkExperienceHeaderList: commonTableHeaderType[] = [
  {
    id: 'companyNum',
    label: '会社番号',
  },
  {
    id: 'name',
    label: '会社名',
  },
  {
    label: '参照されている数',
    id: 'amount',
  },
];

/** 給与ヘッダー */
export const saLaryHeaderList: commonTableHeaderType[] = [
  {
    id: 'sort',
    label: 'sort',
  },
  {
    id: 'companyId',
    label: '会社ID',
  },
  {
    id: 'payday',
    label: '支給日',
  },
  {
    id: 'salary',
    label: '給与',
  },
  {
    id: '',
    label: '',
  },
];

/** 給与に対する税金ヘッダー */
export const monthlyTaxHeaderList: commonTableHeaderType[] = [
  {
    id: 'sort',
    label: 'sort',
  },
  {
    id: 'companyId',
    label: '会社ID',
  },
  {
    id: 'healthInsuranceExpense',
    label: '健康保険料',
  },
  {
    id: 'employeePensionInsuranceExpense',
    label: '厚生年金保険料',
  },
  {
    id: 'nationalPensionInsuranceExpense',
    label: '国民年金保険料',
  },
  {
    id: 'employeeInsuranceExpense',
    label: '雇用保険料',
  },
  {
    id: 'longTermCareInsurance',
    label: '介護保険料',
  },
  {
    id: 'incomeTax',
    label: '所得税',
  },
  {
    id: 'residenceTax',
    label: '住民税',
  },
  {
    id: 'yearEndAdjustment',
    label: '年末調整額',
  },
  {
    id: 'notes',
    label: 'その他',
  },
  {
    id: '',
    label: '',
  },
];
