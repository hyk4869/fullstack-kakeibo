'use client';
import { Box, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import SyncIcon from '@mui/icons-material/Sync';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';

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
        <Box sx={{ display: windowSize ? 'block' : 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ padding: '1rem', minWidth: '250px', fontSize: '1.3rem' }}>{title}</Box>
          <Box sx={{ padding: windowSize ? '0.1rem 1rem' : '1rem', minWidth: '190px', fontSize: '0.75rem' }}>
            レコード数：{dataLength}件
          </Box>
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '1rem', paddingBottom: '5px' }}>
        <Tooltip title="データ取得を行います" arrow>
          <IconButton onClick={setOpenFetchDialog} size="medium" sx={{ ':hover': { color: 'primary.main' } }}>
            <SyncIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={edit ? 'キャンセル' : '編集'} arrow>
          <IconButton
            onClick={handleEditFlag}
            disabled={!idDisabled()}
            size="medium"
            sx={{ ':hover': { color: edit ? 'error.main' : 'primary.main' } }}
          >
            {edit ? <CloseIcon /> : <EditIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="データの追加を行います" arrow>
          <IconButton
            onClick={setOpenAddContent}
            size="medium"
            sx={{ ':hover': { color: 'primary.main' } }}
            disabled={edit === false}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="保存" arrow>
          <IconButton
            onClick={saveValue}
            size="medium"
            sx={{ ':hover': { color: 'primary.main' } }}
            disabled={edit === false}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>

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
