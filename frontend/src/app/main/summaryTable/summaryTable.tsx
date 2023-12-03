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
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_store/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MCategory, TMonthlySpending, setMonthlySpending } from '../../_store/slice';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import CustomTextfield from '../../_customComponents/customTextfield';
import CustomDate from '../../_customComponents/customDate';
import CustomSelectTab from '../../_customComponents/customSelectTab';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import CreateNewRecordsDialog from '../../_dialog/monthlySpending/createNewRecordsDialog';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import { getMonthlySpending, postDeleteMonthlySpending } from '../../_api/url';
import LoadingContent from '../../_util/loading';
import FetchDataDialog from './fetchDataDialog';
import useWindowSize from '@/app/_util/useWindowSize';
import { Order, getComparator, stableSort } from '@/app/_util/utilFunctions';

export interface HeadCell {
  id: keyof TMonthlySpending;
  disablePadding: boolean;
  label: string;
}

export const monthlySpendingHeadCells: readonly HeadCell[] = [
  {
    id: 'id',
    disablePadding: false,
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
  windowSize: boolean;
};

/**
 *
 * ヘッダー
 *
 */
const EnhancedTableHead: React.FC<EnhancedTableProps> = (props) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, windowSize } = props;
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
        {monthlySpendingHeadCells.map((headCell) => (
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
  saveValue: () => void;
  deleteArrayValue: () => void;
  enableEdit: boolean;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  windowSize: boolean;
};

/**
 *
 * 上のソート
 *
 */
const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = (props) => {
  const {
    numSelected,
    edit,
    dataLength,
    handleEditFlag,
    saveValue,
    deleteArrayValue,
    enableEdit,
    isLoading,
    setIsLoading,
    windowSize,
  } = props;

  const [openAddRecordsDialog, setOpenAddRecordsDialog] = useState<boolean>(false);

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
        <Box sx={{ padding: '10px', minWidth: '250px', flex: '1 1 100%' }} color="inherit">
          {numSelected} レコードが選択されました。
        </Box>
      ) : (
        <Box sx={{ display: windowSize ? 'block' : 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ padding: '1rem', minWidth: '250px', fontSize: '1.3rem' }}>クレジットカード明細</Box>
          <Box sx={{ padding: '1rem', minWidth: '190px', fontSize: '0.8rem' }}>レコード数：{dataLength}件</Box>
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '1rem' }}>
        <Button
          variant="contained"
          color={edit ? 'error' : 'primary'}
          disabled={!enableEdit}
          sx={{ cursor: 'pointer' }}
          onClick={handleEditFlag}
        >
          <Tooltip title={edit ? '保存するには「保存を押してください」' : undefined} arrow>
            <span>{edit ? 'キャンセル' : '編集'}</span>
          </Tooltip>
        </Button>
        <Button
          variant="contained"
          disabled={edit === false}
          sx={{ cursor: 'pointer' }}
          onClick={() => setOpenAddRecordsDialog(!openAddRecordsDialog)}
          color="primary"
        >
          追加
        </Button>
        <Button variant="outlined" disabled={edit === false} sx={{ cursor: 'pointer' }} onClick={saveValue}>
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
      <CreateNewRecordsDialog
        openDialog={openAddRecordsDialog}
        onCloseAddRecords={() => setOpenAddRecordsDialog(false)}
        edit={edit}
      />
      <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
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
  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);
  const enableEdit = useSelector((state: RootState) => state.enableEdit);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TMonthlySpending>('id');
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [edit, setEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<Array<TMonthlySpending>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteSomething, setDeleteSomething] = useState<Array<TMonthlySpending>>([]);
  const [openFetchDialog, setOpenFetchDialog] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<boolean>(false);

  const { width, height } = useWindowSize();
  const dispatch = useDispatch();

  useEffect(() => {
    if (width < 840) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width, height]);

  useEffect(() => {
    if (monthlyData.length !== editValue.length) {
      setEditValue(monthlyData);
    }
  }, [monthlyData, enableEdit]);

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
      let newSelected: number[] = [];

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
      stableSort(editValue, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, editValue],
  );

  const handleEditFlag = () => {
    setEdit((edit) => !edit);
  };

  /** listのメモ化 */
  const generateCategoryList = useCallback(() => {
    return categoryData.map((a: MCategory) => ({
      value: Number(a.categoryId),
      label: String(a.categoryName),
    }));
  }, [categoryData]);

  /** 値の編集用 */
  const changeValue = useCallback(
    (id: number, paramKey: string, value: unknown) => {
      setEditValue((prevArray) => {
        return prevArray.map((row) => {
          if (row.id === id) {
            const updatedRow = { ...row };
            switch (paramKey) {
              case 'id':
                updatedRow.id = value === '' ? null : (value as number);
                break;
              case 'paymentDay':
                updatedRow.paymentDay = value === '' ? null : (value as Date);
                break;
              case 'store':
                updatedRow.store = value === '' ? null : (value as string);
                break;
              case 'categoryId':
                updatedRow.categoryId = value === '' ? null : (value as number);
                break;
              case 'usageFee':
                updatedRow.usageFee = value === '' ? null : parseFloat(value as string);
                break;
            }
            return updatedRow;
          } else {
            return row;
          }
        });
      });
    },
    [editValue],
  );

  /**
   * 保存
   */
  const saveValue = async () => {
    setIsLoading(true);
    const postData = editValue.map(({ category, ...data }) => ({
      ...data,
      userId: data.userId || 1,
    }));
    const deleteData = deleteSomething.map(({ category, ...data }) => ({
      ...data,
      userId: data.userId || 1,
    }));
    await axios
      .post(getMonthlySpending, postData)
      .then((res) => {
        if (res.data) {
          dispatch(setMonthlySpending(res.data));
        }
      })
      .catch((error) => {
        console.error(error);
      });
    if (deleteSomething.length !== 0) {
      await axios
        .post(postDeleteMonthlySpending, deleteData)
        .then((res) => {
          if (res.data) {
            console.log('削除するデータあり。');
            dispatch(setMonthlySpending(res.data));
            setDeleteSomething([]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    setIsLoading(false);
    setEdit(false);
  };
  /**
   *
   * saveValueメソッド修正する
   *
   *
   */

  // const saveValue = async () => {
  //   const CHUNK_SIZE = 200;

  //   dispatch(setEditMonthlySpending(editValue));

  //   const chunks = [];
  //   for (let i = 0; i < monthlyData.length; i += CHUNK_SIZE) {
  //     chunks.push(monthlyData.slice(i, i + CHUNK_SIZE));
  //   }

  //   for (const chunk of chunks) {
  //     const postData = chunk.map(({ category, ...data }) => ({
  //       ...data,
  //       userId: data.userId || 1,
  //     }));

  //     try {
  //       const res = await axios.post(getMonthlySpending, postData);
  //       if (res.data) {
  //         dispatch(setMonthlySpending(res.data));
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  /**
   * 削除
   */
  const deleteValue = useCallback(
    (id: number | null) => {
      if (id !== null) {
        setEditValue((prevData) => {
          const updatedData = prevData.filter((d) => d.id !== id);
          const deleteContent = prevData.filter((d) => d.id === id);
          setDeleteSomething((prev) => {
            const uniqueDeleteContent = deleteContent.filter(
              (item) => !prev.some((existingItem) => existingItem.id === item.id),
            );
            return [...prev, ...uniqueDeleteContent];
          });
          return updatedData;
        });
      }
    },
    [editValue, deleteSomething],
  );

  /**
   * 一括削除
   */
  const deleteArrayValue = () => {
    setEditValue((prevValue) => {
      const updatedData = prevValue.filter((a) => !selected.includes(Number(a.id)));
      const deleteContent = prevValue.filter((a) => selected.includes(Number(a.id)));
      setDeleteSomething((prev) => {
        const uniqueDeleteContent = deleteContent.filter(
          (item) => !prev.some((existingItem) => existingItem.id === item.id),
        );
        return [...prev, ...uniqueDeleteContent];
      });
      return updatedData;
    });
    setSelected([]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '95%', margin: '1rem auto' }}>
        <Button color="primary" variant="outlined" onClick={() => setOpenFetchDialog(true)}>
          データ取得
        </Button>
      </Box>

      <Paper sx={{ width: '95%', margin: '1rem auto', background: grey[50] }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          edit={edit}
          dataLength={monthlyData.length}
          handleEditFlag={handleEditFlag}
          saveValue={saveValue}
          deleteArrayValue={deleteArrayValue}
          enableEdit={enableEdit}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          windowSize={windowSize}
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
              windowSize={windowSize}
            />

            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = row.id !== null ? isSelected(row.id as number) : undefined;
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} sx={{ cursor: 'pointer' }}>
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
                    <Tooltip title={'idを変更することはできません'} arrow>
                      <TableCell component="th" id={labelId} scope="row">
                        <CustomNumberFormat
                          value={row.id}
                          edit={false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'id'}
                          id={Number(row.id)}
                        />
                      </TableCell>
                    </Tooltip>
                    <TableCell align="center">
                      <CustomDate
                        value={dayjs(row.paymentDay)}
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
                        list={generateCategoryList()}
                        value={categoryData.find((a) => a.categoryId === row.categoryId)?.categoryId ?? null}
                        edit={edit}
                        paramKey={'categoryId'}
                        id={Number(row?.id)}
                        onChangeValue={changeValue}
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
                    {edit ? (
                      <TableCell align="center">
                        <DeleteIcon
                          onClick={() => deleteValue(row.id)}
                          sx={{ cursor: 'pointer', opacity: '0.4', '&:hover': { opacity: '1' } }}
                        />
                      </TableCell>
                    ) : (
                      <></>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 50, 75]}
          component="div"
          count={monthlyData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <FetchDataDialog openFetchDialog={openFetchDialog} onCloseDialog={() => setOpenFetchDialog(false)} />
      </Paper>
    </Box>
  );
};

export default SummaryTable;
