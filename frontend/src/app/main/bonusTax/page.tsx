'use client';

import { store } from '@/app/_store/store';
import { Provider } from 'react-redux';
import BonusTaxTable from './bonusTaxTable';

const EntryPageBonusTax = () => {
  return (
    <Provider store={store}>
      <BonusTaxTable />
    </Provider>
  );
};
export default EntryPageBonusTax;
