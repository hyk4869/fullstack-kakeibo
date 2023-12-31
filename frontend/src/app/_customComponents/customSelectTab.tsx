import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { colorBlack, commonFontSize } from './customProperties';

type CustomSelectTabProps = {
  onChangeValue: (id: number, paramKey: string, value: number | null) => void;
  paramKey: string;
  id: number;
  value: number | null;
  list?: { value: number; label: string }[];
  edit?: boolean;
  align?: 'left' | 'center' | 'right';
  maxWidth?: string;
  width?: string;
  variant?: 'outlined' | 'filled' | 'standard';
};
const CustomSelectTab: React.FC<CustomSelectTabProps> = (props) => {
  const {
    list,
    value,
    edit,
    align = 'center',
    onChangeValue,
    paramKey,
    id,
    maxWidth = '13rem',
    width,
    variant = 'standard',
  } = props;

  const [labelNumber, setLabelNumber] = useState<number | null>();

  useEffect(() => {
    const stringLabel = list?.find((item) => item.value === value);
    setLabelNumber(stringLabel?.value);
  }, [list]);

  const handleChange = useCallback(
    (e: SelectChangeEvent) => {
      const selectedValue = parseInt(e.target.value, 10);
      setLabelNumber(selectedValue);
      onChangeValue(id, paramKey || '', selectedValue);
    },
    [list, labelNumber],
  );

  return (
    <>
      <FormControl variant={variant} sx={{ justifyContent: align, width: width }} key={id}>
        {edit ? (
          <Select
            value={labelNumber?.toString() ?? ''}
            onChange={handleChange}
            label="category"
            sx={{
              fontSize: commonFontSize,
              minWidth: '10rem',
              maxWidth: maxWidth,
              color: colorBlack,
            }}
            inputProps={{ style: { fontSize: commonFontSize } }}
          >
            {list?.map((data, idx) => {
              return (
                <MenuItem key={idx} value={data.value}>
                  <span style={{ whiteSpace: 'pre-wrap', display: 'flex', justifyContent: align }}>{data.label}</span>
                </MenuItem>
              );
            })}
          </Select>
        ) : (
          <Box sx={{ color: colorBlack, fontSize: commonFontSize }}>
            {list?.find((a) => a.value === Number(labelNumber))?.label}
          </Box>
        )}
      </FormControl>
    </>
  );
};

export default React.memo(CustomSelectTab);
