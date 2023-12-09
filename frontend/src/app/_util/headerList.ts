import { HeadCell } from '../main/summaryTable/summaryTable';
import { commonTableHeaderType } from './commonTableHeader';

/** カテゴリマスタのヘッダー */
export const categoryHeaderList: commonTableHeaderType[] = [
  {
    label: 'id',
    id: 'categoryId',
  },
  {
    label: 'カテゴリー名',
    id: 'categoryName',
  },
];

/** カテゴリーマスタがどれだけ参照されているかのヘッダー */
export const numberOfCategoryHeaderList: commonTableHeaderType[] = [
  {
    label: 'id',
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
    id: 'id',
    label: 'id',
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

/** 月間の収支ヘッダー */
export const monthlySpendingHeaderList: HeadCell[] = [
  {
    id: 'id',
    disablePadding: false,
    label: 'id',
  },
  {
    id: 'paymentDay',
    disablePadding: false,
    label: '利用日',
  },
  {
    id: 'store',
    disablePadding: false,
    label: '利用店',
  },
  {
    id: 'categoryId',
    disablePadding: false,
    label: 'カテゴリー',
  },
  {
    id: 'usageFee',
    disablePadding: false,
    label: '利用金額',
  },
];

/** 職歴マスタのヘッダー */
export const workExperienceHeaderList: commonTableHeaderType[] = [
  {
    id: 'id',
    label: 'id',
  },
  {
    id: 'name',
    label: '会社名',
  },
  {
    id: 'majorSector',
    label: '大分類',
  },
];
