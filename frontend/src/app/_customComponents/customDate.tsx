import React, { useCallback, useEffect, useState, useMemo } from 'react';
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
};

const CustomDate: React.FC<CustomDateProps> = (props) => {
  const { value, edit, paramKey, onChangeValue, id } = props;
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

  const memoizedComponent = useMemo(() => {
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
                maxWidth: '7rem',
                minWidth: minWidth,
              }}
              slotProps={{
                textField: {
                  variant: 'standard',
                  InputProps: {
                    style: { fontSize: commonFontSize, color: colorBlack },
                  },
                },
              }}
            />
          </LocalizationProvider>
        ) : (
          <Box sx={{ fontSize: commonFontSize, color: colorBlack }}>{dayjs(selectedDate).format('YYYY-MM-DD')}</Box>
        )}
      </>
    );
  }, [edit, selectedDate, handleDateChange, onChangeValue, id, paramKey]);

  // return (
  //   <>
  //     {edit ? (
  //       <LocalizationProvider dateAdapter={AdapterDayjs}>
  //         <DatePicker
  //           format="YYYY-MM-DD"
  //           value={selectedDate}
  //           onChange={(e) => handleDateChange(e)}
  //           disabled={!edit}
  //           sx={{
  //             maxWidth: '7rem',
  //             minWidth: minWidth,
  //           }}
  //           slotProps={{
  //             textField: {
  //               variant: 'standard',
  //               InputProps: {
  //                 style: { fontSize: commonFontSize, color: colorBlack },
  //               },
  //             },
  //           }}
  //         />
  //       </LocalizationProvider>
  //     ) : (
  //       <Box>{dayjs(selectedDate).format('YYYY-MM-DD')}</Box>
  //     )}
  //   </>
  // );

  return memoizedComponent;
};

export default React.memo(CustomDate);
