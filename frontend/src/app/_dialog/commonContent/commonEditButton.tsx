import { Box, Button } from '@mui/material';
import React from 'react';

type CommonEditButtonProps<T> = {
  reduxArray: T[];
  arrayLastId: number;
  makeNewArray: T[];
  addNewArray: () => void;
  showDialog: () => void;
  onCloseAddRecords: () => void;
};

export const CommonEditButton = <T,>(props: CommonEditButtonProps<T>): React.ReactElement => {
  const { reduxArray, arrayLastId, makeNewArray, addNewArray, showDialog, onCloseAddRecords } = props;
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          padding: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          {reduxArray.length > 0 ? <Box>レコードの最終ID：{arrayLastId}</Box> : <></>}
          <Box sx={{ margin: '0 2rem' }}>{makeNewArray.length > 0 ? makeNewArray.length : 0} 件のレコードを追加</Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Button variant="contained" color="primary" onClick={() => addNewArray()}>
            レコード追加
          </Button>
          <Button variant="outlined" disabled={makeNewArray.length <= 0} onClick={showDialog}>
            確定
          </Button>
          <Button variant="outlined" color="error" onClick={onCloseAddRecords}>
            キャンセル
          </Button>
        </Box>
      </Box>
    </>
  );
};
