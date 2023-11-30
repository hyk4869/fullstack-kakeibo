'use cliet';

import { Box } from '@mui/material';
import React, { useState } from 'react';
import CustomNumberFormat from '../../_customComponents/customNumeric';

type TestComponentProps = {
  //
};
const TestComponent: React.FC<TestComponentProps> = () => {
  const [edit, setEdit] = useState<boolean>(true);
  const [numberValue, setNumberValue] = useState<number | null>(null);

  const onChangeValue = (id: number, paramKey: string, value: number | null) => {
    switch (paramKey) {
      case 'numberValue':
        typeof value === 'number' ? setNumberValue(value) : setNumberValue(Number(value));
    }
  };

  console.log(numberValue);

  return (
    <Box>
      <CustomNumberFormat
        value={numberValue}
        onChangeValue={onChangeValue}
        paramKey={'numberValue'}
        id={0}
        edit={edit}
      />
    </Box>
  );
};

export default TestComponent;
