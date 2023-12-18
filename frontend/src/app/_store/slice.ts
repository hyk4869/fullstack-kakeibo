import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MCategory, MCompany, MHireDate, TMonthlySpending, TSalary, TSalaryTax } from './interfacesInfo';

/** 月の出費関連 */
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
          console.error('idが重複しています。');
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

    /** 値の削除 */
    setDeleteMonthlySpending: (state, action: PayloadAction<TMonthlySpending[]>) => {
      const deletedIds = action.payload.map((item) => item.id);
      const updatedState = state.filter((item) => deletedIds.includes(item.id));
      return updatedState;
    },
  },
});

/** カテゴリマスタ */
export const getCategoryContent = createSlice({
  name: 'getCategoryContent',
  initialState: [] as MCategory[],
  reducers: {
    /** 値の格納 */
    setCategoryContent: (state, action: PayloadAction<MCategory[]>) => {
      return [...action.payload];
    },
    /** 値の作成 */
    setCreateCategoryContent: (state, action: PayloadAction<MCategory[]>) => {
      const newValue = action.payload.filter((a) => a.categoryId !== null && a.categoryId > 0);
      const valueCheck = state.map((a) => a.categoryId);
      newValue.forEach((a) => {
        if (valueCheck.includes(a.categoryId)) {
          throw new Error('idが重複しています。');
        }
      });
      return [...state, ...action.payload];
    },
  },
});

/** 会社マスタ */
export const getCompanyContent = createSlice({
  name: 'getCompanyContent',
  initialState: [] as MCompany[],
  reducers: {
    /** 値の格納 */
    setCompanyContent: (state, action: PayloadAction<MCompany[]>) => {
      return [...action.payload];
    },
    /** 値の作成 */
    setCreateCompanyContent: (state, action: PayloadAction<MCompany[]>) => {
      const newValue = action.payload.filter((a) => a.id !== null && a.id > 0);
      const valueCheck = state.map((a) => a.id);
      newValue.forEach((a) => {
        if (valueCheck.includes(a.id)) {
          throw new Error('idが重複しています。');
        }
      });
      return [...state, ...action.payload];
    },
  },
});

/** 入退社マスタ */
export const getHireDate = createSlice({
  name: 'getHireDate',
  initialState: [] as MHireDate[],
  reducers: {
    /** 値の格納 */
    setHireDateContent: (state, action: PayloadAction<MHireDate[]>) => {
      return [...action.payload];
    },
    /** 値の作成 */
    setCreateHireDateContent: (state, action: PayloadAction<MHireDate[]>) => {
      const newValue = action.payload.filter((a) => a.id !== null && a.id > 0);
      const valueCheck = state.map((a) => a.id);
      newValue.forEach((a) => {
        if (valueCheck.includes(a.id)) {
          throw new Error('idが重複しています。');
        }
      });
      return [...state, ...action.payload];
    },
  },
});

/** 給与に対する税金 */
export const getSalaryTax = createSlice({
  name: 'getSalaryTax',
  initialState: [] as TSalaryTax[],
  reducers: {
    /** 値の格納 */
    setSalaryTaxContent: (state, action: PayloadAction<TSalaryTax[]>) => {
      return [...action.payload];
    },
  },
});

/** 給与 */
export const getSalary = createSlice({
  name: 'getSalary',
  initialState: [] as TSalary[],
  reducers: {
    /** 値の格納 */
    setSalaryContent: (state, action: PayloadAction<TSalary[]>) => {
      const v = action.payload.map((a) => {
        return {
          ...a,
          payday: a.payday ? new Date(a.payday) : null,
        };
      });
      return [...v];
    },
  },
});

/** edit */
export const enableEdit = createSlice({
  name: 'enableEdit',
  initialState: false,
  reducers: {
    /** editのフラグ */
    setEnableEdit: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export const { setMonthlySpending, setCreateMonthlySpending, setEditMonthlySpending, setDeleteMonthlySpending } =
  getMonthlySpendingContent.actions;
export const { setCategoryContent, setCreateCategoryContent } = getCategoryContent.actions;
export const { setCompanyContent, setCreateCompanyContent } = getCompanyContent.actions;
export const { setHireDateContent, setCreateHireDateContent } = getHireDate.actions;
export const { setSalaryTaxContent } = getSalaryTax.actions;
export const { setSalaryContent } = getSalary.actions;
export const { setEnableEdit } = enableEdit.actions;
