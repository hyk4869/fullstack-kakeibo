'use client';

import { Button } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { getMonthlySpending } from '../_api/url';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '../_store/store';
import { MonthlySpending, setMonthlySpending } from '../_store/slice';

const SummaryTable = () => {
  const [apiBox, setApiBox] = useState<Array<MonthlySpending>>([]);
  const dispatch = useDispatch();

  const data = useSelector((state: RootState) => state.getMonthlySpendingContent);

  const handleClickAPI = () => {
    axios
      .get(getMonthlySpending)
      .then((res) => {
        if (res.data) {
          dispatch(setMonthlySpending(res.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(data);

  return (
    <>
      <div>
        <Button variant='contained' onClick={handleClickAPI}>
          API TEST
        </Button>
        <br />
        <div>{data && data.map((a) => a.store)}</div>
      </div>
    </>
  );
};

export default SummaryTable;
