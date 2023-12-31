import { Box, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { NumericFormat, OnValueChange } from 'react-number-format';
import { colorBlack, commonFontSize, minWidth } from './customProperties';

type CustomNumberFormatProps = {
  value: number | null;
  onChangeValue: (id: number, paramKey: string, value: number | null) => void;
  paramKey: string;
  id: number;
  variant?: 'outlined' | 'filled' | 'standard';
  edit?: boolean;
  suffix?: string;
  align?: 'left' | 'center' | 'right';
  maxWidth?: string;
  width?: string;
  margin?: string;
  thousandSeparator?: boolean;
};
const CustomNumberFormat: React.FC<CustomNumberFormatProps> = (props) => {
  const {
    edit,
    value,
    suffix,
    align = 'center',
    onChangeValue,
    paramKey,
    id,
    maxWidth = '7rem',
    width = '7rem',
    margin = 'auto',
    variant = 'standard',
    thousandSeparator = true,
  } = props;

  const [numeric, setNumeric] = useState<number | null>(value);

  // useEffect(() => {
  //   setNumeric(value);
  // }, [value]);

  useEffect(() => {
    setNumeric((prevNumeric) => {
      if (prevNumeric !== value) {
        return value;
      }
      return prevNumeric;
    });
  }, [value]);

  const hadleChangeNumericValue: OnValueChange = useCallback((values) => {
    const floatValue = values.floatValue !== undefined ? values.floatValue : 0;
    setNumeric(floatValue);
  }, []);

  const handleBlur = useCallback(() => {
    onChangeValue(id, paramKey || '', numeric);
  }, [id, paramKey, numeric, onChangeValue]);

  const formattedValue = !thousandSeparator
    ? numeric
    : numeric !== null
    ? (numeric < 0 ? '-' : '') +
      Math.abs(numeric)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : null;

  return (
    <Box sx={{ display: 'flex', justifyContent: align, maxWidth: maxWidth, minWidth: minWidth, margin: margin }}>
      {edit ? (
        <NumericFormat
          key={id}
          displayType={edit ? 'input' : 'text'}
          customInput={TextFieldCustomInput}
          // customInput={(inputProps) => <TextFieldCustomInput {...inputProps} variant={variant} width={width} />}
          value={numeric}
          thousandSeparator={thousandSeparator}
          style={{ fontSize: commonFontSize, width: width }}
          onValueChange={hadleChangeNumericValue}
          decimalScale={0}
          onBlur={handleBlur}
        />
      ) : (
        <Box sx={{ fontSize: commonFontSize, color: colorBlack }}>{formattedValue}</Box>
      )}

      {suffix ? (
        <Box
          sx={{
            display: variant !== 'standard' ? 'flex' : 'block',
            alignItems: 'center',
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: commonFontSize,
            paddingLeft: '0.7rem',
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
  variant?: 'outlined' | 'filled' | 'standard';
  width?: string;
};
const TextFieldCustomInput: React.FC<TextFieldCustomInputProps> = (props) => {
  const { variant = 'standard', width, ...other } = props;

  return (
    <TextField
      variant={variant}
      InputProps={{ style: { fontSize: commonFontSize, minWidth: minWidth, color: colorBlack, width: width } }}
      {...other}
    />
  );
};

// export default React.memo(CustomNumberFormat, (prevProps, nextProps) => {
//   // React.memo の第二引数は、コンポーネントが再描画されるかどうかを決定するオプションの比較関数
//   // コンポーネントが再描画されるべきでない場合は true。再描画されるべき場合は false を返す。
//   return prevProps.edit === nextProps.edit;
// });

export default React.memo(CustomNumberFormat);
