'use client';

import { GuestRoute } from '@/app/_util/authRoute';
import SignUpPage from './signUpPage';

const EntryPageSignUp = () => {
  return (
    <GuestRoute>
      <SignUpPage />
    </GuestRoute>
  );
};

export default EntryPageSignUp;
