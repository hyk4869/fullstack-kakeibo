'use client';

import { Provider } from 'react-redux';
import { store } from '../_store/store';
import MonthlyAggregationPage from './monthlyAggregation/page';
import EntryPageSummaryTable from './summaryTable/page';

const MainPage = () => {
  return (
    <>
      <EntryPageSummaryTable />
      <MonthlyAggregationPage />
    </>
  );
};

export default MainPage;
