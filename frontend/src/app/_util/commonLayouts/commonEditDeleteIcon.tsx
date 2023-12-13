import { commonPadding5 } from '@/app/_customComponents/customProperties';
import { IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import React, { useEffect } from 'react';

type CommonEditDeleteIconProps = {
  individualEdit: () => void;
  deleteValue: () => void;
  edit: boolean;
  setSelectedRow: React.Dispatch<React.SetStateAction<number>>;
};

const CommonEditDeleteIcon: React.FC<CommonEditDeleteIconProps> = (props) => {
  const { deleteValue, edit, individualEdit, setSelectedRow } = props;

  return (
    <>
      <TableCell align="center" sx={{ padding: commonPadding5 }}>
        <IconButton onClick={() => individualEdit()} disabled={!edit}>
          <EditIcon sx={{ cursor: 'pointer', opacity: '0.5', '&:hover': { opacity: '1' } }} />
        </IconButton>

        <IconButton onClick={() => deleteValue()} disabled={!edit}>
          <DeleteIcon sx={{ cursor: 'pointer', opacity: '0.5', '&:hover': { opacity: '1' } }} />
        </IconButton>
      </TableCell>
    </>
  );
};

export default React.memo(CommonEditDeleteIcon);
