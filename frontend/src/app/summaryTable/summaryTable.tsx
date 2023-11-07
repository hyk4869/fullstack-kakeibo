'use client';

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../_store/store';
import { useCallback, useMemo, useState } from 'react';
import { MCategory, TMonthlySpending, setCreateMonthlySpending } from '../_store/slice';
import CustomNumberFormat from '../_customComponents/customNumeric';
import CustomDate from '../_customComponents/customDate';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import CustomTextfield from '../_customComponents/customTextfield';
import { CustomSelectTab } from '../_customComponents/customSelectTab';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import CustomMonthlyDialog from '../_customComponents/customMonthlyDialog';
import { grey } from '@mui/material/colors';

type Order = 'asc' | 'desc';

interface HeadCell {
  disablePadding: boolean;
  id: keyof TMonthlySpending;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    disablePadding: true,
    label: 'id',
  },
  {
    id: 'paymentDay',
    disablePadding: false,
    label: '利用日',
  },
  {
    id: 'store',
    disablePadding: false,
    label: '利用店',
  },
  {
    id: 'categoryId',
    disablePadding: false,
    label: 'カテゴリー',
  },
  {
    id: 'usageFee',
    disablePadding: false,
    label: '利用金額',
  },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator = (
  order: Order,
  orderBy: keyof TMonthlySpending,
): ((a: TMonthlySpending, b: TMonthlySpending) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (
  array: TMonthlySpending[],
  comparator: (a: TMonthlySpending, b: TMonthlySpending) => number,
): TMonthlySpending[] => {
  const stabilizedThis = array.map((el, index) => [el, index] as [TMonthlySpending, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

type EnhancedTableProps = {
  /** 選択されたID */
  numSelected: number;
  /** 昇順降順の選択 */
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof TMonthlySpending) => void;
  /** 全選択のクリック関数 */
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
};

/**
 *
 * ヘッダー
 *
 */
const EnhancedTableHead: React.FC<EnhancedTableProps> = (props) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof TMonthlySpending) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
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
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
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

type EnhancedTableToolbarProps = {
  numSelected: number;
  edit: boolean;
  dataLength: number;
  handleEditFlag: () => void;
};
/**
 *
 * 上のソート
 *
 */
const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = (props) => {
  const { numSelected, edit, dataLength, handleEditFlag } = props;

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
        display: 'block',
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ padding: '10px', minWidth: '250px' }} variant="h6" id="tableTitle" component="div">
          クレジットカード明細
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button
          variant="contained"
          disabled={dataLength === 0}
          sx={{ margin: '0.75rem 0.75rem', cursor: 'pointer' }}
          onClick={handleEditFlag}
        >
          {edit ? '確定' : '編集'}
        </Button>
        <Button
          variant="contained"
          disabled={dataLength === 0 || edit === false}
          sx={{ margin: '0.75rem 0.75rem', cursor: 'pointer' }}
          onClick={() => setOpenDialog(!openDialog)}
        >
          追加
        </Button>
        <Button
          variant="contained"
          disabled={dataLength === 0 || edit === false}
          sx={{ margin: '0.75rem 0.75rem', cursor: 'pointer' }}
        >
          保存
        </Button>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
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
      <CustomMonthlyDialog openDialog={openDialog} onClose={() => setOpenDialog(false)} edit={edit} />
    </Toolbar>
  );
};

type SummaryTableProps = {
  //
};

/**
 *
 * メイン
 *
 */
const SummaryTable: React.FC<SummaryTableProps> = () => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TMonthlySpending>('id');
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [edit, setEdit] = useState<boolean>(false);

  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);

  /**
   * 昇順降順のソート
   * @param event
   * @param property どの列がクリックされたか
   * @return テーブルの列のクリックに応じて、ソート対象の列とソート順を切り替える役割
   */
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof TMonthlySpending) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /**
   * 全選択のクリック関数
   * @param event boolean event
   * @returns
   */
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected([]);
    if (event.target.checked) {
      setSelected((setNum) => {
        if (monthlyData) {
          const filteredData: number[] = monthlyData.filter((d) => d.id !== null).map((d) => d.id as number);
          return [...setNum, ...filteredData];
        }
        return setNum;
      });
      return;
    }
    setSelected([]);
  };

  /**
   * 行または項目の選択に対しての判定
   * @param event
   * @param id
   */
  const handleSelect = useCallback(
    (event: React.MouseEvent<unknown>, id: number) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected: readonly number[] = [];

      if (selectedIndex === -1) {
        newSelected = [...selected, id];
      } else {
        newSelected = selected.filter((itemId) => itemId !== id);
      }

      setSelected(newSelected);
    },
    [selected],
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [page, rowsPerPage],
  );

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  /**
   * テーブルやリストの表示に必要なデータを計算し、最適化
   */
  const visibleRows = useMemo(
    () =>
      stableSort(monthlyData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, monthlyData],
  );

  const handleEditFlag = () => {
    setEdit((edit) => !edit);
  };

  const changeValue = useCallback((id: number, paramKey: string, value: unknown) => {
    // let _startDate: Date | null;
    // let _endDate: Date | null;
    // switch (paramKey) {
    //   case 'startDate':
    //     _startDate = value !== null ? (value as Date) : null;
    //     setStartDate(_startDate);
    //     break;
    //   case 'endDate':
    //     _endDate = value !== null ? (value as Date) : null;
    //     setEndDate(_endDate);
    //     break;
    // }
  }, []);
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '95%', margin: '1rem auto', background: grey[100] }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          edit={edit}
          dataLength={monthlyData.length}
          handleEditFlag={handleEditFlag}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={monthlyData.length}
            />

            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = row.id !== null ? isSelected(row.id as number) : undefined;
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    // onClick={(event) => {
                    //   if (row.id !== null) {
                    //     handleSelect(event, row.id as number);
                    //   }
                    // }}
                    role="checkbox"
                    // aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    // selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                        onClick={(event) => {
                          if (row.id !== null) {
                            handleSelect(event, row.id as number);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">
                      <CustomDate
                        date={dayjs(row.paymentDay)}
                        edit={edit}
                        onChangeValue={changeValue}
                        paramKey={'paymentDay'}
                        id={Number(row.id)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomTextfield
                        value={row.store}
                        edit={edit}
                        onChangeValue={changeValue}
                        paramKey={'store'}
                        id={Number(row.id)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomSelectTab
                        list={categoryData.map((a: MCategory) => {
                          return { value: String(a.categoryId), label: String(a.categoryName) };
                        })}
                        value={categoryData.find((a) => a.categoryId === row.categoryId)?.categoryName}
                        edit={edit}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomNumberFormat
                        value={row.usageFee}
                        suffix=" 円"
                        edit={edit}
                        align="center"
                        onChangeValue={changeValue}
                        paramKey={'usageFee'}
                        id={Number(row.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}
          component="div"
          count={monthlyData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default SummaryTable;
