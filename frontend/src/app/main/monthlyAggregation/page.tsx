'use client';

import { store } from '@/app/_store/store';
import { Provider } from 'react-redux';
import MonthlyAggregation from './monthlyAggregationPage';

const MonthlyAggregationPage = () => {
  return (
    <>
      <Provider store={store}>
        <MonthlyAggregation />
      </Provider>
    </>
  );
};

export default MonthlyAggregationPage;
