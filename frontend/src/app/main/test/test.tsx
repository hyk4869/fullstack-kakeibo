'use client';

import React from 'react';
import FilledContent from './filledField';
import StandardContent from './standardField';
import OutlinedContent from './outlined';
import { Box, Divider } from '@mui/material';
import OtherUtil from './otherUtil';
import TestApi from './apitest';

type TestComponentProps = {
  //
};

const TestComponent: React.FC<TestComponentProps> = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <FilledContent />
        <OutlinedContent />
        <StandardContent />
      </Box>
      <Divider sx={{ background: 'red', borderWidth: '1px', marginTop: '2rem' }} variant="fullWidth" />
      <Box>
        <OtherUtil />
      </Box>
      <Divider sx={{ background: 'red', borderWidth: '1px', marginTop: '2rem' }} variant="fullWidth" />
      <Box>
        <TestApi />
      </Box>
    </Box>
  );
};

export default TestComponent;
