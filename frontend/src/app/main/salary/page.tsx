'use client';

import { store } from '@/app/_store/store';
import { Provider } from 'react-redux';
import SalaryTable from './salaryTable';
import { PrivateRoute } from '@/app/_util/authRoute';

const EntryPageSalary = () => {
  return (
    <Provider store={store}>
      <PrivateRoute>
        <SalaryTable />
      </PrivateRoute>
    </Provider>
  );
};
export default EntryPageSalary;
