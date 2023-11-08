'use client';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import { getCategory, getMonthlySpending, getSomeMonthlySpending } from '../_api/url';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryContent, setMonthlySpending } from '../_store/slice';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useMemo, useState } from 'react';
import CustomDate from '../_customComponents/customDate';
import { RootState } from '../_store/store';

const ApiButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const dispatch = useDispatch();
  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);

  console.log({ monthlyData, categoryData });

  /** 全期間のデータを取得 */
  const getAllContent = (): void => {
    setIsLoading(true);
    axios
      .get(getMonthlySpending)
      .then((res) => {
        if (res.data) {
          dispatch(setMonthlySpending(res.data));
        }
        return axios.get(getCategory);
      })
      .then((res) => {
        if (res.data) {
          dispatch(setCategoryContent(res.data));
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  /** 期間を指定してデータを取得 */
  const getSomeContent = (): void => {
    setIsLoading(true);
    axios
      .get(getSomeMonthlySpending, {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      })
      .then((res) => {
        if (res.data) {
          dispatch(setMonthlySpending(res.data));
        }
        return axios.get(getCategory);
      })
      .then((res) => {
        if (res.data) {
          dispatch(setCategoryContent(res.data));
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const changeValue = useCallback(
    (id: number, paramKey: string, value: unknown): void => {
      let _startDate: Date | null;
      let _endDate: Date | null;
      switch (paramKey) {
        case 'startDate':
          _startDate = value !== null ? (value as Date) : null;
          setStartDate(_startDate);
          break;
        case 'endDate':
          _endDate = value !== null ? (value as Date) : null;
          setEndDate(_endDate);
          break;
      }
    },
    [startDate, endDate],
  );

  const disable =
    startDate === null ||
    (startDate instanceof Date && isNaN(startDate.getTime())) ||
    endDate === null ||
    (endDate instanceof Date && isNaN(endDate.getTime()));

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', margin: '0.75rem' }}>
          <Box>
            <CustomDate
              date={startDate}
              edit={true}
              onChangeValue={changeValue}
              paramKey="startDate"
              id={0}
            ></CustomDate>
          </Box>
          <span style={{ transform: 'translateX(7px)' }}>{'~'}</span>
          <Box sx={{ margin: ' 0 1rem' }}>
            <CustomDate date={endDate} edit={true} onChangeValue={changeValue} paramKey="endDate" id={0}></CustomDate>
          </Box>
        </Box>

        <Button variant="contained" disabled={disable} onClick={getSomeContent}>
          期間を指定して取得
        </Button>
        <Button variant="contained" onClick={getAllContent} sx={{ transform: 'translateX(30px)' }}>
          全取得
        </Button>
        {isLoading === false ? (
          <></>
        ) : (
          <div
            style={{
              display: 'flex',
              margin: '0 2rem',
              alignItems: 'center',
              maxHeight: '1px',
              transform: 'translateX(50px)',
            }}
          >
            <h5>Loading...</h5>
            <CircularProgress size={20} sx={{ marginLeft: '1rem' }} />
          </div>
        )}
      </div>
    </>
  );
};

export default ApiButton;
