'use client';

import { GuestRoute } from '@/app/_util/authRoute';
import LogiPage from './loginPage';

const EntryPageSignUp = () => {
  return (
    <GuestRoute>
      <LogiPage />
    </GuestRoute>
  );
};

export default EntryPageSignUp;
