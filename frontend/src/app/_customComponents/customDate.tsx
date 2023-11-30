import React, { useCallback, useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { colorBlack, commonFontSize, minWidth } from './customProperties';
import { Box } from '@mui/material';
import dayjs from 'dayjs';

type CustomDateProps = {
  value: Date | Dayjs | null;
  paramKey: string;
  id: number;
  onChangeValue: (id: number, paramKey: string, value: Date | null) => void;
  edit?: boolean;
  format?: string;
  maxWidth?: string;
  width?: string;
  variant?: 'outlined' | 'filled' | 'standard';
};

const CustomDate: React.FC<CustomDateProps> = (props) => {
  const {
    value,
    edit,
    paramKey,
    onChangeValue,
    id,
    format = 'YYYY-MM-DD',
    maxWidth = '7rem',
    width,
    variant = 'standard',
  } = props;
  const [selectedDate, setSelectedDate] = useState<Date | Dayjs | null>(value);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const handleDateChange = useCallback(
    (e: React.SetStateAction<Date | Dayjs | null>) => {
      setSelectedDate(e);

      if (onChangeValue && e !== null) {
        const selectedDateAsDate = (e as Dayjs) ? (e as Dayjs).toDate() : (e as Date);
        onChangeValue(id, paramKey || '', selectedDateAsDate);
      }
    },
    [value, edit, onChangeValue, paramKey, id],
  );

  return (
    <>
      {edit ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            format="YYYY-MM-DD"
            value={selectedDate}
            onChange={(e) => handleDateChange(e)}
            disabled={!edit}
            sx={{
              maxWidth: maxWidth,
              minWidth: minWidth,
            }}
            slotProps={{
              textField: {
                variant: variant,
                InputProps: {
                  style: { fontSize: commonFontSize, color: colorBlack, width: width },
                },
              },
            }}
          />
        </LocalizationProvider>
      ) : (
        <Box sx={{ fontSize: commonFontSize, color: colorBlack }}>{dayjs(selectedDate).format(format)}</Box>
      )}
    </>
  );
};

export default React.memo(CustomDate);
