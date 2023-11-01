import { configureStore } from '@reduxjs/toolkit';
import { getMonthlySpendingContent } from './slice';

export const store = configureStore({
  reducer: {
    getMonthlySpendingContent: getMonthlySpendingContent.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
