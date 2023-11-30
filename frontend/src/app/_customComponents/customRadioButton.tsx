import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useState } from 'react';

export type valueObjType = {
  label: string;
  value: string;
};

type CustomRadioButtonProps = {
  edit: boolean;
  valueObj: valueObjType[];
  value: string;
  paramkey?: string;
  id?: number;
  onChangeValue?: () => void;
  row?: boolean;
};

const CustomRadioButton: React.FC<CustomRadioButtonProps> = (props) => {
  const { edit, valueObj, value, paramkey, id, onChangeValue, row } = props;
  const [radioValue, setRadioValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue(event.target.value);
  };

  return (
    <Box>
      <FormControl>
        <RadioGroup row={row}>
          {valueObj.map((a) => {
            return (
              <>
                <FormControlLabel
                  value={a.value}
                  label={a.label}
                  control={<Radio onChange={(e) => handleChange(e)} />}
                  disabled={!edit}
                />
              </>
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default React.memo(CustomRadioButton);
