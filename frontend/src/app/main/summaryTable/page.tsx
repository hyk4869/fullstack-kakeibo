'use client';

import { Provider } from 'react-redux';
import { store } from '../../_store/store';
import SummaryTable from './summaryTable';
import { PrivateRoute } from '@/app/_util/authRoute';

const EntryPageSummaryTable = () => {
  return (
    <Provider store={store}>
      <PrivateRoute>
        <SummaryTable />
      </PrivateRoute>
    </Provider>
  );
};

export default EntryPageSummaryTable;
