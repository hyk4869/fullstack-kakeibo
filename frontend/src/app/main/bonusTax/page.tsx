'use client';

import { store } from '@/app/_store/store';
import { Provider } from 'react-redux';
import BonusTaxTable from './bonusTaxTable';
import { PrivateRoute } from '@/app/_util/authRoute';

const EntryPageBonusTax = () => {
  return (
    <Provider store={store}>
      <PrivateRoute>
        <BonusTaxTable />
      </PrivateRoute>
    </Provider>
  );
};
export default EntryPageBonusTax;
