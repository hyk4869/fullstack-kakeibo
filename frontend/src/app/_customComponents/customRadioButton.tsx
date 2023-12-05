import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';

export type ValueObjType = {
  label: string;
  value: string;
};

type CustomRadioButtonProps = {
  edit: boolean;
  valueObj: ValueObjType[];
  value: string | null;
  paramkey?: string;
  id?: number;
  onChangeValue?: () => void;
  row?: boolean;
};

const CustomRadioButton: React.FC<CustomRadioButtonProps> = (props) => {
  const { edit, valueObj, value, paramkey, id, onChangeValue, row } = props;
  const [radioValue, setRadioValue] = useState<string | null>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue(event.target.value);
  };

  useEffect(() => {
    setRadioValue(value);
  }, [value]);

  return (
    <Box>
      <FormControl>
        <RadioGroup row={row} onChange={(e) => handleChange(e)} value={radioValue}>
          {valueObj.map((a) => {
            return (
              <FormControlLabel key={a.value} value={a.value} label={a.label} control={<Radio />} disabled={!edit} />
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default React.memo(CustomRadioButton);
