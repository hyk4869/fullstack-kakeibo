'use client';

import { Provider } from 'react-redux';
import { store } from '../../_store/store';
import SummaryTable from './summaryTable';
import ApiButton from './apiButton';

const EntryPageSummaryTable = () => {
  return (
    <Provider store={store}>
      <ApiButton />
      <SummaryTable />
    </Provider>
  );
};

export default EntryPageSummaryTable;
