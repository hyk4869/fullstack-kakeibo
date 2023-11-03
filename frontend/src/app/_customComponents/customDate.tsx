import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

dayjs.locale('ja');

type CustomDateProps = {
  date: Date | null;
  edit?: boolean;
};
export const CustomDate: React.FC<CustomDateProps> = (props) => {
  const { date, edit } = props;
  const [selectedDate, setSelectedDate] = useState<Date | null>(date);

  const handleDateChange = (date: Date | null) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
    const newDate = formattedDate ? new Date(formattedDate) : null;

    setSelectedDate(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="日付"
        format="YYYY-MM-DD"
        value={selectedDate}
        onChange={() => handleDateChange(date)}
        disabled={!edit}
      />
    </LocalizationProvider>
  );
};
