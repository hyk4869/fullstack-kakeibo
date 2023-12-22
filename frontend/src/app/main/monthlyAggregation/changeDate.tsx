'use client';

import CustomSelectTab from '@/app/_customComponents/customSelectTab';
import { MCategory, TMonthlySpending } from '@/app/_store/interfacesInfo';
import { Box, Button } from '@mui/material';
import React, { useCallback, useState } from 'react';

type ChangeAggregationMonthProps = {
  monthlyData: TMonthlySpending[];
  categoryData: MCategory[];
};
type SelectDate = {
  year: number | null;
  month: number | null;
};
const ChangeAggregationMonth: React.FC<ChangeAggregationMonthProps> = (props) => {
  const { monthlyData, categoryData } = props;

  const defaultValue = {
    year: null,
    month: null,
  };
  const [selectedDate, setSelectedDate] = useState<SelectDate>(defaultValue);

  const onChangeValue = useCallback(
    (id: number, paramKey: string, value: number | null) => {
      let _selectedDate = { ...selectedDate };
      switch (paramKey) {
        case 'year':
        case 'month':
          _selectedDate = { ..._selectedDate, [paramKey]: value === null ? null : value };
          break;
      }
      setSelectedDate(_selectedDate);
    },
    [selectedDate],
  );

  const makeYearList = useCallback(() => {
    const getMonth: number[] = monthlyData
      .filter((s) => s.paymentDay !== null)
      .map((a) => (a.paymentDay && a.paymentDay?.getFullYear()) ?? 0);

    const pickUniqueYear: number[] = [...new Set(getMonth)];

    return pickUniqueYear.map((a) => ({
      value: Number(a),
      label: String(a),
    }));
  }, [monthlyData, categoryData]);

  const makeMonthList = useCallback(() => {
    const monthArray = [];
    for (let i = 1; i < 13; i++) {
      monthArray.push(i);
    }
    return monthArray.map((a) => ({
      value: Number(a),
      label: String(a),
    }));
  }, [monthlyData, categoryData]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
      <CustomSelectTab
        value={selectedDate.year}
        paramKey={'year'}
        id={0}
        onChangeValue={onChangeValue}
        edit={true}
        list={makeYearList()}
      />
      <Box>年</Box>
      <CustomSelectTab
        value={selectedDate.month}
        paramKey={'month'}
        id={1}
        onChangeValue={onChangeValue}
        edit={true}
        list={makeMonthList()}
      />
      <Box>月</Box>
      <Button variant="outlined">表示</Button>
    </Box>
  );
};

export default React.memo(ChangeAggregationMonth);
