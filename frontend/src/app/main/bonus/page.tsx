'use client';

import { store } from '@/app/_store/store';
import { Provider } from 'react-redux';
import BonusTable from './bonusTable';
import { PrivateRoute } from '@/app/_util/authRoute';

const EntryPageBonus = () => {
  return (
    <Provider store={store}>
      <PrivateRoute>
        <BonusTable />
      </PrivateRoute>
    </Provider>
  );
};
export default EntryPageBonus;
