import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  MCategory,
  MCompany,
  MHireDate,
  TBonus,
  TBonusTax,
  TMonthlySpending,
  TSalary,
  TSalaryTax,
  UserInfo,
} from './interfacesInfo';

//TODO: 後で全体的に見直し

/** User情報 */
export const getUserInfo = createSlice({
  name: 'getUserInfo',
  initialState: {
    userID: '',
    email: '',
    color: '',
    lastLoginAt: null,
    createdAt: null,
    updatedAt: null,
  } as UserInfo,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      const lastLoginAt = action.payload.lastLoginAt !== null ? new Date(action.payload.lastLoginAt) : null;
      const createdAt = action.payload.createdAt !== null ? new Date(action.payload.createdAt) : null;
      const updatedAt = action.payload.updatedAt !== null ? new Date(action.payload.updatedAt) : null;
      const userID = action.payload.userID !== null ? String(action.payload.userID) : '';
      const email = action.payload.email !== null ? String(action.payload.email) : '';
      const color = action.payload.color !== null ? String(action.payload.color) : '';
      return {
        ...action.payload,
        userID: userID,
        email: email,
        color: color,
        lastLoginAt: lastLoginAt,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };
    },
  },
});

export const headerHeightSlice = createSlice({
  name: 'headerHeight',
  initialState: 0,
  reducers: {
    setHeaderHeight: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
  },
});

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
      const newItems = action.payload.filter((d) => d.sort !== null && d.sort > 0);
      const valueCheck = state.map((s) => s.sort);

      newItems.forEach((a) => {
        if (valueCheck.includes(a.sort)) {
          console.error('idが重複しています。');
          return state;
        }
      });

      return [...state, ...action.payload];
    },

    /** 値の編集 */
    setEditMonthlySpending: (state, action: PayloadAction<TMonthlySpending[]>) => {
      const updatedState = state.map((existingItem) => {
        const matchingItem = action.payload.find((newItem) => newItem.sort === existingItem.sort);
        return matchingItem ? { ...existingItem, ...matchingItem } : existingItem;
      });

      return updatedState;
    },

    /** 値の削除 */
    setDeleteMonthlySpending: (state, action: PayloadAction<TMonthlySpending[]>) => {
      const deletedIds = action.payload.map((item) => item.sort);
      const updatedState = state.filter((item) => deletedIds.includes(item.sort));
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
      const newValue = action.payload.filter((a) => a.sort !== null && a.sort > 0);
      const valueCheck = state.map((a) => a.sort);
      newValue.forEach((a) => {
        if (valueCheck.includes(a.sort)) {
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
      const newValue = action.payload.filter((a) => a.sort !== null && a.sort > 0);
      const valueCheck = state.map((a) => a.sort);
      newValue.forEach((a) => {
        if (valueCheck.includes(a.sort)) {
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
      const newValue = action.payload.filter((a) => a.sort !== null && a.sort > 0);
      const valueCheck = state.map((a) => a.sort);
      newValue.forEach((a) => {
        if (valueCheck.includes(a.sort)) {
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
    /** 値の作成 */
    setCreateSalaryTax: (state: TSalaryTax[], action: PayloadAction<TSalaryTax[]>) => {
      const newItems = action.payload.filter((d) => d.sort !== null && d.sort > 0);
      const valueCheck = state.map((s) => s.sort);

      newItems.forEach((a) => {
        if (valueCheck.includes(a.sort)) {
          console.error('idが重複しています。');
          return state;
        }
      });

      return [...state, ...action.payload];
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

    /** 値の作成 */
    setCreateSalary: (state: TSalary[], action: PayloadAction<TSalary[]>) => {
      const newItems = action.payload.filter((d) => d.sort !== null && d.sort > 0);
      const valueCheck = state.map((s) => s.sort);

      newItems.forEach((a) => {
        if (valueCheck.includes(a.sort)) {
          console.error('idが重複しています。');
          return state;
        }
      });

      return [...state, ...action.payload];
    },
  },
});

/** 賞与に対する税金 */
export const getBonusTax = createSlice({
  name: 'getBonusTax',
  initialState: [] as TBonusTax[],
  reducers: {
    /** 値の格納 */
    setBonusTaxContent: (state, action: PayloadAction<TBonusTax[]>) => {
      return [...action.payload];
    },
    /** 値の作成 */
    setCreateBonusTax: (state: TBonusTax[], action: PayloadAction<TBonusTax[]>) => {
      const newItems = action.payload.filter((d) => d.sort !== null && d.sort > 0);
      const valueCheck = state.map((s) => s.sort);

      newItems.forEach((a) => {
        if (valueCheck.includes(a.sort)) {
          console.error('idが重複しています。');
          return state;
        }
      });

      return [...state, ...action.payload];
    },
  },
});

/** 賞与 */
export const getBonus = createSlice({
  name: 'getBonus',
  initialState: [] as TBonus[],
  reducers: {
    /** 値の格納 */
    setBonusContent: (state, action: PayloadAction<TBonus[]>) => {
      const v = action.payload.map((a) => {
        return {
          ...a,
          payday: a.payday ? new Date(a.payday) : null,
        };
      });
      return [...v];
    },

    /** 値の作成 */
    setCreateBonus: (state: TBonus[], action: PayloadAction<TBonus[]>) => {
      const newItems = action.payload.filter((d) => d.sort !== null && d.sort > 0);
      const valueCheck = state.map((s) => s.sort);

      newItems.forEach((a) => {
        if (valueCheck.includes(a.sort)) {
          console.error('idが重複しています。');
          return state;
        }
      });

      return [...state, ...action.payload];
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

export const { setUserInfo } = getUserInfo.actions;
export const { setMonthlySpending, setCreateMonthlySpending, setEditMonthlySpending, setDeleteMonthlySpending } =
  getMonthlySpendingContent.actions;
export const { setCategoryContent, setCreateCategoryContent } = getCategoryContent.actions;
export const { setCompanyContent, setCreateCompanyContent } = getCompanyContent.actions;
export const { setHireDateContent, setCreateHireDateContent } = getHireDate.actions;
export const { setSalaryTaxContent, setCreateSalaryTax } = getSalaryTax.actions;
export const { setSalaryContent, setCreateSalary } = getSalary.actions;
export const { setBonusTaxContent, setCreateBonusTax } = getBonusTax.actions;
export const { setBonusContent, setCreateBonus } = getBonus.actions;
export const { setEnableEdit } = enableEdit.actions;
export const { setHeaderHeight } = headerHeightSlice.actions;
