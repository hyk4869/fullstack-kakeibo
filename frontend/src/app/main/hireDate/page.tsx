'use client';

import { store } from '@/app/_store/store';
import { Provider } from 'react-redux';
import HireDateTable from './hireDateTable';

const EntryHireDateTable = () => {
  return (
    <Provider store={store}>
      <HireDateTable />
    </Provider>
  );
};

export default EntryHireDateTable;
