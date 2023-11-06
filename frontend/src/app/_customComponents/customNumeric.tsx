import { Box, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { NumericFormat, OnValueChange } from 'react-number-format';
import { commonFontSize, minWidth } from './customProperties';

type CustomNumberFormatProps = {
  value: number | null;
  onChangeValue: (id: number, paramKey: string, value: number | null) => void;
  paramKey: string;
  id: number;
  inputRef?: React.Ref<HTMLInputElement>;
  variant?: 'outlined' | 'filled' | 'standard';
  edit?: boolean;
  suffix?: string;
  align?: 'left' | 'center' | 'right';
};
export const CustomNumberFormat: React.FC<CustomNumberFormatProps> = (props) => {
  const { inputRef, edit, value, suffix, align = 'center', onChangeValue, paramKey, id, ...other } = props;
  const [numeric, setNumeric] = useState<number | null>(value);

  useEffect(() => {
    setNumeric(value);
  }, [value]);

  const hadleChangeNumericValue: OnValueChange = useCallback(
    (values) => {
      const floatValue = values.floatValue !== undefined ? values.floatValue : 0;
      setNumeric(floatValue);
      onChangeValue(id, paramKey || '', floatValue);
    },
    [value],
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: align, maxWidth: '7rem', minWidth: minWidth }}>
      <NumericFormat
        inputRef={inputRef as React.Ref<HTMLInputElement>}
        getInputRef={inputRef}
        displayType={edit ? 'input' : 'text'}
        customInput={TextFieldCustomInput}
        value={numeric}
        thousandSeparator={true}
        style={{ fontSize: commonFontSize }}
        onValueChange={hadleChangeNumericValue}
        decimalScale={0}
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
      InputProps={{ style: { fontSize: commonFontSize, minWidth: minWidth } }}
      {...other}
    />
  );
};
