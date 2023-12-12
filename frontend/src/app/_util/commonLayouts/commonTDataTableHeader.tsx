import React from 'react';
import { Order } from '../utilFunctions';
import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { commonTableHeaderType } from './commonTableHeader';
import { grey } from '@mui/material/colors';

export type CommonTDataTableHeaderProps<T> = {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  labelList: commonTableHeaderType[];
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  order: Order;
  setOrderBy?: React.Dispatch<React.SetStateAction<keyof T>>;
  orderBy?: keyof T;
};

/** ジェネリクスで書いた共通のヘッダー */
const CommonTDataTableHeader = <T,>(props: CommonTDataTableHeaderProps<T>): React.ReactElement => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, labelList, setOrder, setOrderBy } = props;

  /**
   * 昇順降順のソート
   * @param event
   * @param property どの列がクリックされたか
   * @return テーブルの列のクリックに応じて、ソート対象の列とソート順を切り替える役割
   */
  const onRequestSort = (event: React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    if (setOrderBy) {
      setOrderBy(property);
    }
  };

  const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" sx={{ background: grey[50] }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {labelList.map((a) => (
          <TableCell
            key={a.id}
            align={'center'}
            sortDirection={orderBy === a.id ? order : false}
            sx={{ background: grey[50] }}
          >
            <TableSortLabel
              active={orderBy === a.id}
              direction={orderBy === a.id ? order : 'asc'}
              onClick={createSortHandler(a.id as keyof T)}
            >
              {a.label}
              {orderBy === a.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default CommonTDataTableHeader;
