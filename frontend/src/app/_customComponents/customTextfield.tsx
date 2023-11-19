import { Box, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { commonFontSize } from './customProperties';

type CustomTextfieldProps = {
  value: string | null;
  onChangeValue: (id: number, paramKey: string, value: string | null) => void;
  paramKey: string;
  id: number;
  inputRef?: React.Ref<HTMLInputElement>;
  edit?: boolean;
  align?: 'left' | 'center' | 'right';
};
const CustomTextfield: React.FC<CustomTextfieldProps> = (props) => {
  const { value, edit, align = 'center', onChangeValue, paramKey, id, ...other } = props;

  const [textValue, setTextValue] = useState<string | null>(value);

  useEffect(() => {
    if (value !== textValue) {
      setTextValue(value);
    }
  }, [value, textValue]);

  const handleChangeText = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    onChangeValue(id, paramKey || '', textValue);
  }, [id, paramKey, textValue, onChangeValue]);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: align }}>
        <TextField
          variant="standard"
          value={textValue}
          disabled={!edit}
          onChange={(e) => handleChangeText(e)}
          onBlur={handleBlur}
          sx={{
            fontSize: commonFontSize,
            minWidth: '13rem',
          }}
          InputProps={{ style: { fontSize: commonFontSize, minWidth: '13rem' } }}
          {...other}
        />
      </Box>
    </>
  );
};

export default React.memo(CustomTextfield);
