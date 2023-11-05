import { PayloadAction, createSlice } from '@reduxjs/toolkit';

/**月の出費 */
export interface MonthlySpending {
  /** id番号 */
  id: number | null;
  /** ユーザーID */
  userId: number | null;
  /** 利用日 */
  paymentDay: Date | null;
  /** 利用店 */
  store: string | null;
  /** 利用金額 */
  usageFee: number | null;
  /** カテゴリー */
  category: {
    /** カテゴリーID */
    categoryId: number | null;
    /** カテゴリー名 */
    categoryName: string | null;
    /** ユーザーID */
    userId: number | null;
  };
}

export interface MCategory {
  categoryId: number | null;
  userId: number | null;
  categoryName: string | null;
}

export const getMonthlySpendingContent = createSlice({
  name: 'getMonthlySpendingContent',
  initialState: [] as MonthlySpending[],
  reducers: {
    /** 値の格納 */
    setMonthlySpending: (state, action: PayloadAction<MonthlySpending[]>) => {
      return [...action.payload];
    },
    /** 値の作成 */
    setCreateMonthlySpending: (state: MonthlySpending[], action: PayloadAction<MonthlySpending[]>) => {
      const newItems = action.payload.filter((d) => d.id !== null && d.id >= 0);
      const valueCheck = state.map((s) => s.id);
      newItems.forEach((a) => {
        if (valueCheck.includes(a.id)) {
          return window.alert('idが重複しています。');
        }
      });
      return [...state, ...action.payload];
    },
  },
});

export const getCategoryContent = createSlice({
  name: 'getCategoryContent',
  initialState: [] as MCategory[],
  reducers: {
    /** 値の格納 */
    setCategoryContent: (state, action: PayloadAction<MCategory[]>) => {
      return [...action.payload];
    },
  },
});

export const { setMonthlySpending, setCreateMonthlySpending } = getMonthlySpendingContent.actions;
export const { setCategoryContent } = getCategoryContent.actions;
