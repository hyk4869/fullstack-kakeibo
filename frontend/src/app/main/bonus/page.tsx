'use client';

import { store } from '@/app/_store/store';
import { Provider } from 'react-redux';
import BonusTable from './bonusTable';

const EntryPageBonus = () => {
  return (
    <Provider store={store}>
      <BonusTable />
    </Provider>
  );
};
export default EntryPageBonus;
