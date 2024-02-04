import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  enableEdit,
  getBonus,
  getBonusTax,
  getCategoryContent,
  getCompanyContent,
  getHireDate,
  getMonthlySpendingContent,
  getSalary,
  getSalaryTax,
  getUserInfo,
  headerHeightSlice,
} from './slice';

export const store = configureStore({
  reducer: {
    getUserInfo: getUserInfo.reducer,
    getMonthlySpendingContent: getMonthlySpendingContent.reducer,
    getCategoryContent: getCategoryContent.reducer,
    getCompanyContent: getCompanyContent.reducer,
    getHireDate: getHireDate.reducer,
    enableEdit: enableEdit.reducer,
    getSalaryTax: getSalaryTax.reducer,
    getSalary: getSalary.reducer,
    getBonusTax: getBonusTax.reducer,
    getBonus: getBonus.reducer,
    headerHeightSlice: headerHeightSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
