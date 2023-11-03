'use client';
import { Button } from '@mui/material';
import axios from 'axios';
import { getMonthlySpending } from '../_api/url';
import { useDispatch } from 'react-redux';
import { setMonthlySpending } from '../_store/slice';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';

const ApiButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleClickAPI = () => {
    setIsLoading(true);
    axios
      .get(getMonthlySpending)
      .then((res) => {
        if (res.data) {
          dispatch(setMonthlySpending(res.data));
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button variant="contained" onClick={handleClickAPI}>
          API TEST
        </Button>
        {isLoading === false ? (
          <></>
        ) : (
          <div style={{ display: 'flex', margin: '0 2rem', alignItems: 'center', maxHeight: '1px' }}>
            <h5>Loading...</h5>
            <CircularProgress size={20} sx={{ marginLeft: '1rem' }} />
          </div>
        )}
      </div>
    </>
  );
};

export default ApiButton;
