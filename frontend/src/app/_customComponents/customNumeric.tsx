import { Box, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { NumericFormat, OnValueChange } from 'react-number-format';
import { commonFontSize, minWidth } from './customProperties';

type CustomNumberFormatProps = {
  value: number | null;
  onChangeValue: (id: number, paramKey: string, value: number | null) => void;
  paramKey: string;
  id: number;
  variant?: 'outlined' | 'filled' | 'standard';
  edit?: boolean;
  suffix?: string;
  align?: 'left' | 'center' | 'right';
};
const CustomNumberFormat: React.FC<CustomNumberFormatProps> = (props) => {
  const { edit, value, suffix, align = 'center', onChangeValue, paramKey, id, ...other } = props;
  const [numeric, setNumeric] = useState<number | null>(value);

  useEffect(() => {
    setNumeric(value);
  }, []);

  const hadleChangeNumericValue: OnValueChange = useCallback((values) => {
    const floatValue = values.floatValue !== undefined ? values.floatValue : 0;
    setNumeric(floatValue);
  }, []);

  const handleBlur = useCallback(() => {
    onChangeValue(id, paramKey || '', numeric);
  }, [id, paramKey, numeric, onChangeValue]);

  return (
    <Box sx={{ display: 'flex', justifyContent: align, maxWidth: '7rem', minWidth: minWidth, margin: 'auto' }}>
      <NumericFormat
        displayType={edit ? 'input' : 'text'}
        customInput={TextFieldCustomInput}
        value={numeric}
        thousandSeparator={true}
        style={{ fontSize: commonFontSize }}
        onValueChange={hadleChangeNumericValue}
        decimalScale={0}
        onBlur={handleBlur}
        {...other}
      />
      {suffix ? (
        <Box
          sx={{
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: commonFontSize,
            paddingLeft: '0.5rem',
          }}
        >
          {suffix}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

type TextFieldCustomInputProps = {
  // inputRef: React.Ref<HTMLInputElement>;
};
const TextFieldCustomInput: React.FC<TextFieldCustomInputProps> = (props) => {
  const { ...other } = props;
  return (
    <TextField variant="standard" InputProps={{ style: { fontSize: commonFontSize, minWidth: minWidth } }} {...other} />
  );
};

export default React.memo(CustomNumberFormat);
