'use client';

import { Button } from '@mui/material';
import axios from 'axios';
import { getMonthlySpending } from '../_api/url';
import { useDispatch } from 'react-redux';
import { MonthlySpending, setMonthlySpending } from '../_store/slice';
import styles from './apiTest.module.css';
import { format } from 'date-fns';
import dayjs from 'dayjs';

const ApiButton = () => {
  const dispatch = useDispatch();

  const handleClickAPI = () => {
    axios
      .get(getMonthlySpending)
      .then((res) => {
        if (res.data) {
          /** storeに格納する前に日付のフォーマとを修正 */
          const formattedData: MonthlySpending[] = res.data.map((item: MonthlySpending) => ({
            ...item,
            paymentDay: item.paymentDay ? dayjs(item.paymentDay) : null,
          }));
          dispatch(setMonthlySpending(formattedData));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div>
        <Button variant="contained" onClick={handleClickAPI}>
          API TEST
        </Button>
      </div>
    </>
  );
};

export default ApiButton;