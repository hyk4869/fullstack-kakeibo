import React, { useCallback, useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { commonFontSize, minWidth } from './customProperties';

type CustomDateProps = {
  value: Date | Dayjs | null;
  paramKey: string;
  id: number;
  onChangeValue: (id: number, paramKey: string, value: Date | null) => void;
  edit?: boolean;
};

const CustomDate: React.FC<CustomDateProps> = (props) => {
  const { value, edit, paramKey, onChangeValue, id } = props;
  const [selectedDate, setSelectedDate] = useState<Date | Dayjs | null>(value);

  useEffect(() => {
    if (value !== selectedDate) {
      setSelectedDate(value);
    }
  }, [value, selectedDate]);

  const handleDateChange = useCallback(
    (e: React.SetStateAction<Date | Dayjs | null>) => {
      setSelectedDate(e);

      if (onChangeValue && e !== null) {
        const selectedDateAsDate = (e as Dayjs) ? (e as Dayjs).toDate() : (e as Date);
        onChangeValue(id, paramKey || '', selectedDateAsDate);
      }
    },
    [value, edit, onChangeValue, paramKey],
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

export default React.memo(CustomDate);
