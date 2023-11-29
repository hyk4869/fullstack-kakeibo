import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useState } from 'react';

export type valueObjType = {
  label: string;
  value: string;
};

type CustomRadioButtonProps = {
  edit: boolean;
  valueObj: valueObjType[];
  paramkey?: string;
  id?: number;
  onChangeValue?: () => void;
  defaultValue?: string;
};

const CustomRadioButton: React.FC<CustomRadioButtonProps> = (props) => {
  const { edit, valueObj, paramkey, id, onChangeValue, defaultValue } = props;
  const [radioValue, setRadioValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue(event.target.value);
  };

  return (
    <Box>
      <FormControl>
        <RadioGroup>
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
