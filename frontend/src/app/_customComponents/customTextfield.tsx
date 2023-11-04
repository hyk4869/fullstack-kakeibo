import { Box, TextField } from '@mui/material';
import React from 'react';
import { commonFontSize } from './customProperties';

type CustomTextfieldProps = {
  inputRef?: React.Ref<HTMLInputElement>;
  value?: string | null;
  edit?: boolean;
  align?: 'left' | 'center' | 'right';
};
export const CustomTextfield: React.FC<CustomTextfieldProps> = (props) => {
  const { value, edit, align = 'center', ...other } = props;

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
