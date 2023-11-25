type ListContentType = {
  label: string;
  key: number;
  link: string;
};

export const HomeListURL: Array<ListContentType> = [{ label: 'Home', key: 1, link: '/' }];

export const MonthlySpendingListURL: Array<ListContentType> = [
  { label: 'Detail List', key: 2, link: '/summaryTable' },
  { label: 'Each Monthly List', key: 3, link: '/' },
  { label: 'Category', key: 4, link: '/category' },
  { label: 'ER Figure', key: 5, link: '/erFigure' },
  { label: 'Test', key: 6, link: '/test' },
];

export const SalaryListURL: Array<ListContentType> = [
  { label: 'Salary', key: 7, link: '/' },
  { label: 'Tax Related Salary', key: 8, link: '/' },
  { label: 'Bonus', key: 9, link: '/' },
  { label: 'Tax Related Bonus', key: 10, link: '/' },
  { label: 'Company', key: 11, link: '/' },
  { label: 'Hire Date', key: 12, link: '/' },
];
