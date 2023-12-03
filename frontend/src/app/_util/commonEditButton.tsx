'use client';
import { Box, Button, Toolbar } from '@mui/material';
import React from 'react';

type CommonEditButtopnProps = {
  edit: boolean;
  handleEditFlag: () => void;
  title: string;
  setOpenAddContent: () => void;
  saveValue: () => void;
};
const CommonEditButton: React.FC<CommonEditButtopnProps> = (props) => {
  const { edit, handleEditFlag, title, setOpenAddContent, saveValue } = props;
  return (
    <>
      <Toolbar sx={{ display: 'block' }}>
        <Box sx={{ padding: '1rem', minWidth: '170px' }}>{title}</Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Button color={edit ? 'error' : 'primary'} variant="contained" onClick={handleEditFlag}>
            {edit ? 'キャンセル' : '編集'}
          </Button>
          <Button
            variant="contained"
            disabled={edit === false}
            sx={{ cursor: 'pointer' }}
            color="primary"
            onClick={setOpenAddContent}
          >
            追加
          </Button>
          <Button variant="outlined" disabled={edit === false} color="primary" onClick={saveValue}>
            保存
          </Button>
        </Box>
      </Toolbar>
    </>
  );
};

export default React.memo(CommonEditButton);
