import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { enableEdit, getCategoryContent, getCompanyContent, getHireDate, getMonthlySpendingContent } from './slice';

export const store = configureStore({
  reducer: {
    getMonthlySpendingContent: getMonthlySpendingContent.reducer,
    getCategoryContent: getCategoryContent.reducer,
    getCompanyContent: getCompanyContent.reducer,
    getHireDate: getHireDate.reducer,
    enableEdit: enableEdit.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
