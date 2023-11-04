import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { commonFontSize } from './customProperties';

type CustomSelectTabProps = {
  list?: { value: string; label: string }[];
  value?: string | null;
  edit?: boolean;
  align?: 'left' | 'center' | 'right';
};
export const CustomSelectTab: React.FC<CustomSelectTabProps> = (props) => {
  const { list, value, edit, align = 'center', ...other } = props;

  const [selectItem, setSelectItem] = useState<string>();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectItem(event.target.value);
  };

  useEffect(() => {
    setSelectItem(String(value));
  }, []);

  const validValue = list?.find((item) => item.label === value)?.value;
  const initialValue = validValue || '';

  return (
    <>
      <FormControl variant="standard" sx={{ minWidth: '4rem', justifyContent: align }}>
        {edit ? (
          <Select
            value={initialValue}
            onChange={handleChange}
            label="category"
            sx={{
              fontSize: commonFontSize,
              minWidth: '13rem',
            }}
            inputProps={{ style: { fontSize: commonFontSize, minWidth: '13rem' } }}
          >
            {list?.map((data, idx) => {
              return (
                <MenuItem key={idx} value={data.value}>
                  <span style={{ whiteSpace: 'pre-wrap' }}>{data.label}</span>
                </MenuItem>
              );
            })}
          </Select>
        ) : (
          <Box>{selectItem}</Box>
        )}
      </FormControl>
    </>
  );
};
