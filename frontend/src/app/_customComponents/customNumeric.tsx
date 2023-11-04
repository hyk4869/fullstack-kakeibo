import { Box, TextField } from '@mui/material';
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { commonFontSize } from './customProperties';

type CustomNumberFormatProps = {
  inputRef?: React.Ref<HTMLInputElement>;
  variant?: 'outlined' | 'filled' | 'standard';
  edit?: boolean;
  value?: number | null;
  suffix?: string;
  align?: 'left' | 'center' | 'right';
};
export const CustomNumberFormat: React.FC<CustomNumberFormatProps> = (props) => {
  const { inputRef, edit, value, suffix, align = 'center', ...other } = props;

  return (
    <Box sx={{ display: 'flex', justifyContent: align, maxWidth: '9rem' }}>
      <NumericFormat
        inputRef={inputRef as React.Ref<HTMLInputElement>}
        getInputRef={inputRef}
        displayType={edit ? 'input' : 'text'}
        customInput={TextFieldCustomInput}
        value={value}
        thousandSeparator={true}
        style={{ fontSize: commonFontSize }}
        {...other}
      />
      <Box sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: commonFontSize }}>{suffix}</Box>
    </Box>
  );
};

type TextFieldCustomInputProps = {
  inputRef: React.Ref<HTMLInputElement>;
};
const TextFieldCustomInput: React.FC<TextFieldCustomInputProps> = (props) => {
  const { inputRef, ...other } = props;
  return (
    <TextField
      variant="standard"
      inputRef={inputRef}
      InputProps={{ style: { fontSize: commonFontSize, maxWidth: '6rem' } }}
      {...other}
    />
  );
};
