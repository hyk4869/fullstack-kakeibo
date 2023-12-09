'use client';

import { store } from '@/app/_store/store';
import { Provider } from 'react-redux';
import SalaryTaxTable from './salaryTaxTable';

const EntryPageSalaryTax = () => {
  return (
    <Provider store={store}>
      <SalaryTaxTable />
    </Provider>
  );
};
export default EntryPageSalaryTax;
