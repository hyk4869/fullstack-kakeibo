import { configureStore } from '@reduxjs/toolkit';
import { getCategoryContent, getMonthlySpendingContent } from './slice';

export const store = configureStore({
  reducer: {
    getMonthlySpendingContent: getMonthlySpendingContent.reducer,
    getCategoryContent: getCategoryContent.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
