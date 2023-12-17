'use client';

import { store } from '@/app/_store/store';
import { Provider } from 'react-redux';
import SalaryTable from './salaryTable';

const EntryPageSalary = () => {
  return (
    <Provider store={store}>
      <SalaryTable />
    </Provider>
  );
};
export default EntryPageSalary;
