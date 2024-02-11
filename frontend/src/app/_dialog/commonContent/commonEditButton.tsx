import { Box, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

type CommonEditButtonProps<T> = {
  reduxArray: T[];
  arrayLastId: number;
  makeNewArray: T[];
  addNewArray: () => void;
  showDialog: () => void;
  onCloseAddRecords: () => void;
  windowSize: boolean;
};

export const CommonEditButton = <T,>(props: CommonEditButtonProps<T>): React.ReactElement => {
  const { reduxArray, arrayLastId, makeNewArray, addNewArray, showDialog, onCloseAddRecords, windowSize } = props;

  return (
    <>
      <Box
        sx={{
          display: windowSize ? 'block' : 'flex',
          flexDirection: 'row',
          padding: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: windowSize ? 'block' : 'flex',
            alignItems: 'center',
            fontSize: '1rem',
            padding: '0 1rem',
            gap: '1rem',
          }}
        >
          {reduxArray.length > 0 ? <Box>レコードの最終ID：{arrayLastId}</Box> : <></>}
          <Box>{makeNewArray.length > 0 ? makeNewArray.length : 0} 件のレコードを追加</Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1.5rem' }}>
          <Tooltip title="レコードの追加" arrow>
            <IconButton onClick={() => addNewArray()} size="medium" sx={{ ':hover': { color: 'primary.main' } }}>
              <AddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="確定" arrow>
            <IconButton
              onClick={showDialog}
              disabled={makeNewArray.length <= 0}
              size="medium"
              sx={{ ':hover': { color: 'primary.main' } }}
            >
              <CheckIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="キャンセル" arrow>
            <IconButton onClick={onCloseAddRecords} size="medium" color="error">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
};
