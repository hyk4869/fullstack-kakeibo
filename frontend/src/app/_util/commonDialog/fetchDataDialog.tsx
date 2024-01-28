'use client';

import { Box, Button, Dialog, IconButton } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setEnableEdit } from '../../_store/slice';
import React, { useState } from 'react';
import { RootState } from '../../_store/store';
import LoadingContent from '../commonLayouts/loading';
import CloseIcon from '@mui/icons-material/Close';
import Cookies from 'js-cookie';
import { PayloadAction } from '@reduxjs/toolkit';

type FetchDataDialogProps<T> = {
  openFetchDialog: boolean;
  onCloseDialog: () => void;
  setReduxValue: (payload: T[]) => PayloadAction<T[], string>;
  reduxValue: T[];
  api: string;
};

/** ジェネリクスで書いた共通のAPI取得 */
const FetchDataDialog = <T,>(props: FetchDataDialogProps<T>): React.ReactElement => {
  const { openFetchDialog, onCloseDialog, setReduxValue, reduxValue, api } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.getUserInfo);

  const jwtToken = Cookies.get('authToken');

  /** 全期間のデータを取得 */
  const getAllContent = (): void => {
    setIsLoading(true);
    axios
      .get(api, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        params: {
          userID: user.userID,
        },
      })
      .then((res) => {
        if (res.data) {
          dispatch(setReduxValue(res.data));
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

  const clearAllContent = () => {
    dispatch(setReduxValue([]));
  };

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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={clearAllContent}
              sx={{}}
              disabled={reduxValue.length <= 0}
            >
              テーブルをクリア
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
