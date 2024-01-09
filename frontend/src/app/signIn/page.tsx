'use client';

import { GuestRoute } from '@/app/_util/authRoute';
import LogiPage from './loginPage';
import { Provider } from 'react-redux';
import { store } from '../_store/store';

const EntryPageSignUp = () => {
  return (
    <Provider store={store}>
      <GuestRoute>
        <LogiPage />
      </GuestRoute>
    </Provider>
  );
};

export default EntryPageSignUp;
