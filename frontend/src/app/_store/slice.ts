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
    setMonthlySpending: (state, action: PayloadAction<MonthlySpending[]>) => {
      return action.payload;
    },
  },
});

export const getCategoryContent = createSlice({
  name: 'getCategoryContent',
  initialState: [] as MCategory[],
  reducers: {
    setCategoryContent: (state, action: PayloadAction<MCategory[]>) => {
      return action.payload;
    },
  },
});

export const { setMonthlySpending } = getMonthlySpendingContent.actions;
export const { setCategoryContent } = getCategoryContent.actions;
