'use client';

import { Provider } from 'react-redux';
import { store } from '../../_store/store';
import WorkExperienceTable from './workExperienceTable';

const EntryPageSummaryTable = () => {
  return (
    <Provider store={store}>
      <WorkExperienceTable />
    </Provider>
  );
};

export default EntryPageSummaryTable;
