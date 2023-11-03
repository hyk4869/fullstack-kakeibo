import { Box, TextField } from '@mui/material';
import React from 'react';
import { NumericFormat } from 'react-number-format';

type CustomNumberFormatProps = {
  inputRef?: React.Ref<any>;
  variant?: 'outlined' | 'filled' | 'standard';
  edit?: boolean;
  value?: number | null;
  suffix?: string;
  align?: 'left' | 'center' | 'right';
};
const CustomNumberFormat: React.FC<CustomNumberFormatProps> = (props) => {
  const { inputRef, variant, edit, value, suffix, align = 'center', ...other } = props;

  return (
    <Box sx={{ display: 'flex', justifyContent: align }}>
      <NumericFormat
        inputRef={null}
        getInputRef={inputRef}
        displayType={edit ? 'input' : 'text'}
        customInput={TextFieldCustomInput}
        value={value}
        {...other}
      />
      <Box sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>{suffix}</Box>
    </Box>
  );
};

type TextFieldCustomInputProps = {
  inputRef: React.Ref<HTMLInputElement>;
};
const TextFieldCustomInput: React.FC<TextFieldCustomInputProps> = (props) => {
  const { inputRef, ...other } = props;
  return <TextField variant="standard" inputRef={inputRef} {...other} />;
};

export default CustomNumberFormat;
