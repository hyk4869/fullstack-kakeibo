import { PayloadAction, createSlice } from '@reduxjs/toolkit';

/**月の出費 */
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
}

/** カテゴリー */
export interface Mcategory {
  /** カテゴリーID */
  categoryId: number | null;
  /** カテゴリー名 */
  categoryName: string | null;
  /** ユーザーID */
  userId: number | null;
}

export interface MCategory {
  categoryId: number | null;
  userId: number | null;
  categoryName: string | null;
}

export const getMonthlySpendingContent = createSlice({
  name: 'getMonthlySpendingContent',
  initialState: [] as TMonthlySpending[],
  reducers: {
    /** 値の格納 */
    setMonthlySpending: (state, action: PayloadAction<TMonthlySpending[]>) => {
      const v = action.payload.map((d) => {
        return {
          ...d,
          paymentDay: d.paymentDay ? new Date(d.paymentDay) : null,
        };
      });
      return [...v];
    },

    /** 値の作成 */
    setCreateMonthlySpending: (state: TMonthlySpending[], action: PayloadAction<TMonthlySpending[]>) => {
      const newItems = action.payload.filter((d) => d.id !== null && d.id > 0);
      const valueCheck = state.map((s) => s.id);

      newItems.forEach((a) => {
        if (valueCheck.includes(a.id)) {
          console.log('idが重複しています。');
          return state;
        }
      });
      return [...state, ...action.payload];
    },

    /** 値の編集 */
    setEditMonthlySpending: (state, action: PayloadAction<TMonthlySpending[]>) => {
      const updatedState = state.map((existingItem) => {
        const matchingItem = action.payload.find((newItem) => newItem.id === existingItem.id);
        return matchingItem ? { ...existingItem, ...matchingItem } : existingItem;
      });

      return updatedState;
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

export const { setMonthlySpending, setCreateMonthlySpending, setEditMonthlySpending } =
  getMonthlySpendingContent.actions;
export const { setCategoryContent } = getCategoryContent.actions;
