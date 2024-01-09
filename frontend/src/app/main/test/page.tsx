'use client';
import { Box } from '@mui/material';
import TestComponent from './test';
import { GuestRoute } from '@/app/_util/authRoute';

type TestProps = {
  //
};
const Test: React.FC<TestProps> = () => {
  return (
    <GuestRoute>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <TestComponent />
      </Box>
    </GuestRoute>
  );
};

export default Test;
