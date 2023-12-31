import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ValueObjType } from './customRadioButton';

type CustomToggleButtonProps = {
  edit: boolean;
  valueObj: ValueObjType[];
  value: string;
  paramkey: string;
  id?: number;
  onChangeValue: (id: number, paramKey: string, value: string | null) => void;
};

const CustomToggleButton: React.FC<CustomToggleButtonProps> = (props) => {
  const { edit, valueObj, value, paramkey, id, onChangeValue } = props;
  const [toggleButtonValue, setToggleButtonValue] = useState<string | null>('');

  useEffect(() => {
    setToggleButtonValue(value);
  }, [value]);

  const handleChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, newAlignment: string) => {
    setToggleButtonValue(newAlignment);
    onChangeValue(id !== undefined ? id : 0, paramkey || '', newAlignment);
  };

  return (
    <>
      <Box>
        <ToggleButtonGroup
          color="primary"
          exclusive
          onChange={handleChange}
          value={toggleButtonValue}
          aria-label="Platform"
          disabled={!edit}
        >
          {valueObj.map((a) => {
            return (
              <ToggleButton
                key={a.value}
                value={a.value}
                style={{ backgroundColor: a.value === toggleButtonValue ? '#bbdbf3' : 'inherit' }}
              >
                {a.label}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Box>
    </>
  );
};

export default React.memo(CustomToggleButton);
