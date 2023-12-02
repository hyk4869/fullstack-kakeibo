'use client';

import { Provider } from 'react-redux';
import { store } from '../../_store/store';
import SummaryTable from './summaryTable';

const EntryPageSummaryTable = () => {
  return (
    <Provider store={store}>
      <SummaryTable />
    </Provider>
  );
};

export default EntryPageSummaryTable;
