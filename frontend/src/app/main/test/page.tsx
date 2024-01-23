'use client';
import { Box } from '@mui/material';
import TestComponent from './test';
import { PrivateRoute } from '@/app/_util/authRoute';

type TestProps = {
  //
};
const Test: React.FC<TestProps> = () => {
  return (
    <PrivateRoute>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <TestComponent />
      </Box>
    </PrivateRoute>
  );
};

export default Test;
