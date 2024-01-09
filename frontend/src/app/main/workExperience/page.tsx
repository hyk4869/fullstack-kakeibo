'use client';

import { Provider } from 'react-redux';
import { store } from '../../_store/store';
import WorkExperienceTable from './workExperienceTable';
import { PrivateRoute } from '@/app/_util/authRoute';

const EntryPageCompanyTable = () => {
  return (
    <Provider store={store}>
      <PrivateRoute>
        <WorkExperienceTable />
      </PrivateRoute>
    </Provider>
  );
};

export default EntryPageCompanyTable;
