import { Box, TextField } from '@mui/material';
import React from 'react';
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
export const CustomTextfield: React.FC<CustomTextfieldProps> = (props) => {
  const { value, edit, align = 'center', onChangeValue, paramKey, id, ...other } = props;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: align }}>
        <TextField
          variant="standard"
          value={value}
          disabled={!edit}
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
