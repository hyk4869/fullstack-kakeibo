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

      // TODO: const iso8601String = parsedDate.toISOString(); ISO 8601 形式ににする。
      // TODO: 重複idの厳重チェック
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
