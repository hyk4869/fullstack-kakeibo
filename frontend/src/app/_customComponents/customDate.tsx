import React, { useCallback, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

type CustomDateProps = {
  date: Date | Dayjs | null;
  edit?: boolean;
};

export const CustomDate: React.FC<CustomDateProps> = (props) => {
  const { date, edit } = props;
  const [selectedDate, setSelectedDate] = useState<Date | Dayjs | null>(date);

  const handleDateChange = useCallback(
    (date: Date | Dayjs | null) => {
      setSelectedDate(date);
    },
    [date, edit],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="日付"
        format="YYYY-MM-DD"
        value={selectedDate}
        onChange={handleDateChange}
        disabled={!edit}
        slotProps={{ textField: { variant: 'standard' } }}
      />
    </LocalizationProvider>
  );
};
