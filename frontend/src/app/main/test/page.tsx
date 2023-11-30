'use client';
import { Box } from '@mui/material';
import TestComponent from './test';

type TestProps = {
  //
};
const Test: React.FC<TestProps> = () => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <TestComponent />
      </Box>
    </>
  );
};

export default Test;
