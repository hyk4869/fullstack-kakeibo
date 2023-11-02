'use client';

import { Button } from '@mui/material';
import axios from 'axios';
import { getMonthlySpending } from '../_api/url';
import { useDispatch } from 'react-redux';
import { setMonthlySpending } from '../_store/slice';
import styles from './apiTest.module.css';

const ApiButton = () => {
  const dispatch = useDispatch();

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

  return (
    <>
      <div>
        <Button variant='contained' onClick={handleClickAPI}>
          API TEST
        </Button>
      </div>
    </>
  );
};

export default ApiButton;
