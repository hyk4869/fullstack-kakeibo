import { Box, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { colorBlack, commonFontSize } from './customProperties';

type CustomTextfieldProps = {
  value: string | null;
  onChangeValue: (id: number, paramKey: string, value: string | null) => void;
  paramKey: string;
  id: number;
  inputRef?: React.Ref<HTMLInputElement>;
  edit?: boolean;
  align?: 'left' | 'center' | 'right';
  variant?: 'outlined' | 'filled' | 'standard';
};
const CustomTextfield: React.FC<CustomTextfieldProps> = (props) => {
  const { value, edit, align = 'center', onChangeValue, paramKey, id, variant = 'standard', ...other } = props;

  const [textValue, setTextValue] = useState<string | null>(value);

  useEffect(() => {
    setTextValue(value);
  }, [value]);

  const handleChangeText = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    onChangeValue(id, paramKey || '', textValue);
  }, [id, paramKey, textValue, onChangeValue]);

  return (
    <>
      {edit ? (
        <Box sx={{ display: 'flex', justifyContent: align }}>
          <TextField
            variant={variant}
            value={textValue}
            disabled={!edit}
            onChange={(e) => handleChangeText(e)}
            onBlur={handleBlur}
            sx={{
              fontSize: commonFontSize,
              minWidth: '13rem',
            }}
            InputProps={{ style: { fontSize: commonFontSize, minWidth: '13rem', color: colorBlack } }}
            {...other}
          />
        </Box>
      ) : (
        <Box sx={{ fontSize: commonFontSize, minWidth: '13rem', color: colorBlack }}>{textValue}</Box>
      )}
    </>
  );
};

export default React.memo(CustomTextfield);
