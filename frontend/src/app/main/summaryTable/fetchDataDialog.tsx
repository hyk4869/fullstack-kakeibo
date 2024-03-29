'use client';

import { Box, Button, Dialog, IconButton, Tooltip } from '@mui/material';
import axios from 'axios';
import { getMonthlySpending, getSomeMonthlySpending } from '../../_api/url';
import { useDispatch, useSelector } from 'react-redux';
import { setEnableEdit, setMonthlySpending } from '../../_store/slice';
import React, { useCallback, useState } from 'react';
import CustomDate from '../../_customComponents/customDate';
import { RootState } from '../../_store/store';
import LoadingContent from '../../_util/commonLayouts/loading';
import CloseIcon from '@mui/icons-material/Close';
import Cookies from 'js-cookie';

type FetchDataDialogProps = {
  openFetchDialog: boolean;
  onCloseDialog: () => void;
  windowSize: boolean;
};

const FetchDataDialog: React.FC<FetchDataDialogProps> = (props) => {
  const { openFetchDialog, onCloseDialog, windowSize } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const dispatch = useDispatch();
  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const user = useSelector((state: RootState) => state.getUserInfo);

  const jwtToken = Cookies.get('authToken');

  /** 全期間のデータを取得 */
  const getAllContent = (): void => {
    setIsLoading(true);
    axios
      .get(getMonthlySpending, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        params: {
          userID: user.userID,
        },
      })
      .then((res) => {
        if (res.data) {
          dispatch(setMonthlySpending(res.data));
          dispatch(setEnableEdit(true));
        }
      })
      .catch((error) => {
        console.error(error);
        onCloseDialog();
      })
      .finally(() => {
        setIsLoading(false);
        onCloseDialog();
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
          userID: user.userID,
        },
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((res) => {
        if (res.data) {
          dispatch(setMonthlySpending(res.data));
          dispatch(setEnableEdit(true));
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        onCloseDialog();
      })
      .finally(() => {
        setIsLoading(false);
        onCloseDialog();
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

  const clearAllContent = () => {
    dispatch(setMonthlySpending([]));
  };

  const disable =
    startDate === null ||
    (startDate instanceof Date && isNaN(startDate.getTime())) ||
    endDate === null ||
    (endDate instanceof Date && isNaN(endDate.getTime()));

  return (
    <Dialog open={openFetchDialog} onClose={onCloseDialog} maxWidth="lg">
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
          <h4>データ取得</h4>
          <IconButton onClick={onCloseDialog} sx={{ cursor: 'pointer' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ padding: '2rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Box sx={{ display: 'flex', flexDirection: !windowSize ? 'row' : 'column' }}>
              <CustomDate value={startDate} edit={true} onChangeValue={changeValue} paramKey="startDate" id={0} />
              <span style={{ padding: '0 1rem' }}>{'~'}</span>
              <CustomDate value={endDate} edit={true} onChangeValue={changeValue} paramKey="endDate" id={1} />
            </Box>

            <Tooltip title={'取得する日付を選んでください'} arrow>
              <Box>
                <Button variant="outlined" disabled={disable} onClick={getSomeContent}>
                  期間で取得
                </Button>
              </Box>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={clearAllContent}
              sx={{}}
              disabled={monthlyData.length <= 0}
            >
              テーブルクリア
            </Button>
            <Button variant="contained" onClick={getAllContent} sx={{}}>
              全取得
            </Button>
          </Box>

          <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
        </Box>
      </Box>
    </Dialog>
  );
};

export default React.memo(FetchDataDialog);
