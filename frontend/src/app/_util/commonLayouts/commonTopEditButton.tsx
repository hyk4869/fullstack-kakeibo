'use client';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';

type CommonEditButtopnProps = {
  edit: boolean;
  handleEditFlag: () => void;
  title: string;
  setOpenAddContent: () => void;
  saveValue: () => void;
  numSelected: number;
  windowSize: boolean;
  dataLength: number;
  deleteArrayValue: () => void;
  setOpenFetchDialog?: () => void;
  enableEdit?: boolean;
};
const CommonTopEditButton: React.FC<CommonEditButtopnProps> = (props) => {
  const {
    edit,
    handleEditFlag,
    title,
    setOpenAddContent,
    saveValue,
    numSelected,
    windowSize,
    dataLength,
    deleteArrayValue,
    setOpenFetchDialog,
    enableEdit,
  } = props;

  const idDisabled = (): boolean => {
    if (enableEdit !== undefined) {
      return enableEdit;
    } else {
      return true;
    }
  };
  return (
    <>
      {numSelected > 0 ? (
        <Box sx={{ padding: '10px', minWidth: '250px', flex: '1 1 100%' }} color="inherit">
          {numSelected} レコードが選択されました。
        </Box>
      ) : (
        <Box sx={{ display: windowSize ? 'block' : 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ padding: '1rem', minWidth: '250px', fontSize: '1.3rem' }}>{title}</Box>
          <Box sx={{ padding: '1rem', minWidth: '190px', fontSize: '0.8rem' }}>レコード数：{dataLength}件</Box>
        </Box>
      )}
      <Box
        sx={
          !windowSize
            ? {
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                gap: '1rem',
                paddingBottom: '5px',
              }
            : {
                display: 'block',
                '& > *': {
                  marginInlineEnd: '0.5rem',
                },
                paddingLeft: '1rem',
              }
        }
      >
        <Button color="primary" variant="outlined" onClick={setOpenFetchDialog}>
          データ取得
        </Button>
        <Button
          color={edit ? 'error' : 'primary'}
          variant="contained"
          onClick={handleEditFlag}
          disabled={!idDisabled()}
        >
          <Tooltip title={edit ? '保存するには「保存を押してください」' : undefined} arrow>
            <span>{edit ? 'キャンセル' : '編集'}</span>
          </Tooltip>
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
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={() => deleteArrayValue()}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </>
  );
};

export default React.memo(CommonTopEditButton);
