'use client';

import { store } from '@/app/_store/store';
import { Provider } from 'react-redux';
import HireDateTable from './hireDateTable';
import { PrivateRoute } from '@/app/_util/authRoute';

const EntryHireDateTable = () => {
  return (
    <Provider store={store}>
      <PrivateRoute>
        <HireDateTable />
      </PrivateRoute>
    </Provider>
  );
};

export default EntryHireDateTable;
