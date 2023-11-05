import React, { useCallback, useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { commonFontSize, minWidth } from './customProperties';

type CustomDateProps = {
  date: Date | Dayjs | null;
  edit?: boolean;
  paramKey: string;
  onChangeValue: (paramKey: string, value: Date | null) => void;
};

export const CustomDate: React.FC<CustomDateProps> = (props) => {
  const { date, edit, paramKey, onChangeValue } = props;
  const [selectedDate, setSelectedDate] = useState<Date | Dayjs | null>(date);

  useEffect(() => {
    setSelectedDate(date);
  }, []);

  const handleDateChange = useCallback(
    (e: React.SetStateAction<Date | Dayjs | null>) => {
      setSelectedDate(e);

      if (onChangeValue && e !== null) {
        const selectedDateAsDate = (e as Dayjs) ? (e as Dayjs).toDate() : (e as Date);
        onChangeValue(paramKey || '', selectedDateAsDate);
      }
    },
    [date, edit, onChangeValue, paramKey],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        format="YYYY-MM-DD"
        value={selectedDate}
        onChange={(e) => handleDateChange(e)}
        disabled={!edit}
        sx={{
          fontSize: commonFontSize,
          maxWidth: '7rem',
          minWidth: minWidth,
        }}
        slotProps={{
          textField: {
            variant: 'standard',
            InputProps: {
              style: { fontSize: commonFontSize },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
