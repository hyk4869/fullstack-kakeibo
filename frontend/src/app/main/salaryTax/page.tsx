'use client';

import { store } from '@/app/_store/store';
import { Provider } from 'react-redux';
import SalaryTaxTable from './salaryTaxTable';
import { PrivateRoute } from '@/app/_util/authRoute';

const EntryPageSalaryTax = () => {
  return (
    <Provider store={store}>
      <PrivateRoute>
        <SalaryTaxTable />
      </PrivateRoute>
    </Provider>
  );
};
export default EntryPageSalaryTax;
