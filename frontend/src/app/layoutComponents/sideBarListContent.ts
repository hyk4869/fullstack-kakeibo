type ListContentType = {
  label: string;
  key: number;
  link: string;
  isMaster: boolean;
};

export const HomeListURL: Array<ListContentType> = [
  { label: 'Home', key: 1, link: '/', isMaster: false },
  { label: 'Sample Form', key: 2, link: '/main/test', isMaster: false },
];

export const MonthlySpendingListURL: Array<ListContentType> = [
  { label: '毎月の出費入力', key: 3, link: '/main/summaryTable', isMaster: false },
  { label: '各種集計', key: 4, link: '/main/monthlyAggregation', isMaster: false },
  { label: 'カテゴリーマスタ', key: 5, link: '/main/category', isMaster: true },
];

export const SalaryListURL: Array<ListContentType> = [
  { label: '給与明細', key: 6, link: '/main/salary', isMaster: false },
  { label: '給与に対する税金', key: 7, link: '/main/salaryTax', isMaster: false },
  { label: '賞与明細', key: 8, link: '/main/', isMaster: false },
  { label: '賞与に対する税金', key: 9, link: '/main/', isMaster: false },
  { label: '職歴マスタ', key: 10, link: '/main/workExperience', isMaster: true },
  { label: '入退社マスタ', key: 11, link: '/main/hireDate', isMaster: true },
];
