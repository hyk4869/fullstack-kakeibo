import { configureStore } from '@reduxjs/toolkit';
import { getCategoryContent, getMonthlySpendingContent } from './slice';

export const store = configureStore({
  reducer: {
    getMonthlySpendingContent: getMonthlySpendingContent.reducer,
    getCategoryContent: getCategoryContent.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

// import { configureStore } from '@reduxjs/toolkit';
// import { combineReducers } from 'redux';

// import { getCategoryContent, getMonthlySpendingContent } from './slice';

// const rootReducer = combineReducers({
//   getMonthlySpendingContent: getMonthlySpendingContent.reducer,
//   getCategoryContent: getCategoryContent.reducer,
// });

// export const store = configureStore({
//   reducer: rootReducer,
// });

// export type RootState = ReturnType<typeof store.getState>;
