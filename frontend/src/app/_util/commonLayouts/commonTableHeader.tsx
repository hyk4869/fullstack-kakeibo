'use client';

import { TableCell, TableRow, TableHead } from '@mui/material';
import React from 'react';
import { commonPadding5 } from '../../_customComponents/customProperties';

export type commonTableHeaderType = {
  id: string;
  label: string;
};

type CommonTableHeaderProps = {
  categoryHeaderList: commonTableHeaderType[];
};

const CommonTableHeader: React.FC<CommonTableHeaderProps> = (props) => {
  const { categoryHeaderList } = props;
  return (
    <>
      <TableHead sx={{ padding: commonPadding5 }}>
        <TableRow sx={{ padding: commonPadding5 }}>
          {categoryHeaderList.map((a) => {
            return (
              <TableCell key={a.id} align={'center'} sx={{ padding: commonPadding5 }}>
                {a.label}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    </>
  );
};

export default React.memo(CommonTableHeader);
