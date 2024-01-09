'use client';

import { store } from '@/app/_store/store';
import { Provider } from 'react-redux';
import MonthlyAggregation from './monthlyAggregationPage';
import { PrivateRoute } from '@/app/_util/authRoute';

const MonthlyAggregationPage = () => {
  return (
    <>
      <Provider store={store}>
        <PrivateRoute>
          <MonthlyAggregation />
        </PrivateRoute>
      </Provider>
    </>
  );
};

export default MonthlyAggregationPage;
