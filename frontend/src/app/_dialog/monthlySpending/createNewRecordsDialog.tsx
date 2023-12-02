import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { MCategory, TMonthlySpending } from '../../_store/slice';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import CustomDate from '../../_customComponents/customDate';
import CustomSelectTab from '../../_customComponents/customSelectTab';
import CustomTextfield from '../../_customComponents/customTextfield';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import { RootState } from '../../_store/store';
import dayjs from 'dayjs';
import { useEffect, useState, useCallback, useMemo } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { grey, red } from '@mui/material/colors';
import MonthlyNextActionDialog from './monthlyNextActionDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExportCSV } from '../../_util/exportCSV';
import { ImportCSV } from '../../_util/monthlySpendingUtil/importCSV';
import { ShowCategoryMaster } from './showCategory';
import TablePagination from '@mui/material/TablePagination';
import { Order, getComparator, monthlySpendingHeadCells, stableSort } from '../../main/summaryTable/summaryTable';
import { visuallyHidden } from '@mui/utils';
import { monthlySpendingHeaders } from '../../_util/exportCSVTitleName';

type CreateNewRecordsDialogProps = {
  openDialog: boolean;
  onCloseAddRecords: () => void;
  edit?: boolean;
};

const CreateNewRecordsDialog: React.FC<CreateNewRecordsDialogProps> = (props) => {
  const { openDialog, onCloseAddRecords, edit } = props;
  const [arrayLastId, setArrayLastId] = useState<number>(0);
  const [increment, setIncrement] = useState<number>(arrayLastId);
  const [incrementArray, setIncrementArray] = useState<Array<number>>([]);
  const [makeNewArray, setMakeNewArray] = useState<Array<TMonthlySpending>>([]);
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false);
  const [isShowCategoryMaster, setIsShowCategoryMaster] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TMonthlySpending>('id');

  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);

  useEffect(() => {
    if (monthlyData && monthlyData.length >= 0) {
      const ID: number =
        monthlyData.length !== 0 || monthlyData !== undefined
          ? monthlyData.reduce((maxId, item) => Math.max(maxId, item.id ?? 0), 1)
          : 1;
      setArrayLastId(ID);
      setIncrement(ID);
    }
  }, [monthlyData]);

  useEffect(() => {
    if (increment !== null && increment !== undefined && increment > 0 && incrementArray.slice(-1)[0] !== increment) {
      setIncrementArray((prevValue) => [...prevValue, increment]);
    }
  }, [increment]);

  // console.log({ arrayLastId, increment, incrementArray, makeNewArray, monthlyData });

  /** 新しいレコードの追加 */
  const addNewArray = useCallback(() => {
    const incrementFromArray = () => {
      if (makeNewArray.length <= 0 && monthlyData.length <= 0) {
        return 1;
      } else if (makeNewArray.length !== 0) {
        return incrementArray.slice(-1)[0] + 1;
      } else if (monthlyData.length > 0) {
        return incrementArray.slice(-1)[0] + 1;
      } else {
        return incrementArray.slice(-1)[0] + 1;
      }
    };
    const lastId = makeNewArray.slice(-1)[0]?.id;
    if (lastId && incrementFromArray() === lastId) return;
    const newMonthlySpending = {
      id: incrementFromArray(),
      userId: null,
      paymentDay: null,
      store: '',
      usageFee: null,
      categoryId: null,
    };

    setIncrement(incrementFromArray);
    setMakeNewArray((prevArray) => [...prevArray, newMonthlySpending]);
  }, [increment, makeNewArray, incrementArray]);

  /** 削除機能 */
  const deleteValue = useCallback(
    (id: number | null) => {
      if (id === arrayLastId) return;
      const deletedArray = makeNewArray.filter((a) => a.id !== id);
      setMakeNewArray(deletedArray);

      if (id !== null) {
        const sortedValue = incrementArray.filter((s) => s !== id).map((a) => (a > id ? a - 1 : a));
        setIncrementArray(sortedValue);
        setMakeNewArray((prevId) =>
          prevId.map((a) => {
            return {
              ...a,
              id: a.id && a.id > id ? a.id - 1 : a.id,
            };
          }),
        );
        setIncrement(sortedValue.slice(-1)[0]);
      }
    },
    [makeNewArray, incrementArray],
  );

  /** 値の更新 */
  const changeValue = useCallback(
    (id: number, paramKey: string, value: unknown) => {
      setMakeNewArray((prevArray) => {
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
    [makeNewArray],
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

  const visibleRows = useMemo(
    () =>
      stableSort(makeNewArray, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, makeNewArray],
  );

  /** 次へ進むためのboolean */
  const showDialog = () => {
    setIsShowDialog(!isShowDialog);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Dialog
        open={openDialog ?? false}
        onClose={onCloseAddRecords}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen={true}
      >
        <Paper sx={{ width: '95%', margin: '1rem auto', background: grey[50] }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', padding: '1rem', justifyContent: 'center' }}>
            {monthlyData.length > 0 ? <Box>レコードの最終ID：{arrayLastId}</Box> : <></>}
            <Box sx={{ margin: '0 2rem' }}>{makeNewArray.length > 0 ? makeNewArray.length : 0} 件のレコードを追加</Box>
            <AddCircleOutlineIcon
              onClick={() => addNewArray()}
              sx={{ cursor: 'pointer', opacity: '0.5', '&:hover': { opacity: '1' } }}
            />
          </Box>

          <TableContainer sx={{ display: 'flex', justifyContent: 'center', width: '100%', maxHeight: '550px' }}>
            <Table>
              <TableHead>
                <TableRow>
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

              <TableBody>
                {visibleRows?.map((row) => {
                  return (
                    <TableRow
                      tabIndex={-1}
                      key={Number(row?.id)}
                      sx={{
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell component="th" id={String(row?.id)} scope="row?">
                        <CustomNumberFormat
                          value={row?.id}
                          edit={false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'id'}
                          id={Number(row?.id)}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <CustomDate
                          value={dayjs(row?.paymentDay)}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'paymentDay'}
                          id={Number(row?.id)}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <CustomTextfield
                          value={row?.store}
                          onChangeValue={changeValue}
                          paramKey={'store'}
                          id={Number(row?.id)}
                          edit={edit}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <CustomSelectTab
                          list={categoryData.map((a: MCategory) => {
                            return { value: Number(a.categoryId), label: String(a.categoryName) };
                          })}
                          value={categoryData.find((a) => a.categoryId === row?.categoryId)?.categoryId ?? null}
                          edit={edit}
                          paramKey={'categoryId'}
                          id={Number(row?.id)}
                          onChangeValue={changeValue}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <CustomNumberFormat
                          value={row?.usageFee}
                          suffix=" 円"
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'usageFee'}
                          id={Number(row?.id)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <DeleteIcon
                          onClick={() => deleteValue(row.id)}
                          sx={{ cursor: 'pointer', opacity: '0.5', '&:hover': { opacity: '1' } }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: '0.75rem 0.75rem' }}
              onClick={() => addNewArray()}
            >
              レコード追加
            </Button>
            <Button
              variant="outlined"
              sx={{ margin: '0.75rem 0.75rem' }}
              disabled={makeNewArray.length - 1 === 0}
              onClick={showDialog}
            >
              確定
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{
                margin: '0.75rem 0.75rem',
                color: red[500],
                borderColor: red[500],
              }}
              onClick={onCloseAddRecords}
            >
              キャンセル
            </Button>
          </Box>
          {makeNewArray.length < 20 ? (
            <></>
          ) : (
            <TablePagination
              rowsPerPageOptions={[20, 50, 100]}
              component="div"
              count={makeNewArray.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Paper>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ position: 'absolute', bottom: '0' }}>
            <ExportCSV headerOption={monthlySpendingHeaders} />
            <ImportCSV
              setMakeNewArray={setMakeNewArray}
              setIncrementArray={setIncrementArray}
              setArrayLastId={setArrayLastId}
              setIncrement={setIncrement}
            />
            <Button onClick={() => setIsShowCategoryMaster(true)} variant="outlined" sx={{ margin: '0.75rem 0.75rem' }}>
              カテゴリーIDを参照する
            </Button>
          </Box>
        </Box>

        <MonthlyNextActionDialog
          isShow={isShowDialog}
          onCloseConfirmDialog={() => setIsShowDialog(false)}
          contentNum={makeNewArray.length}
          content={makeNewArray}
          onCloseMonthlyDialog={onCloseAddRecords}
          setMakeNewArray={setMakeNewArray}
        />
        <ShowCategoryMaster
          isShowCategoryMaster={isShowCategoryMaster}
          onCloseCategoryMaster={() => setIsShowCategoryMaster(false)}
        />
      </Dialog>
    </Box>
  );
};

export default React.memo(CreateNewRecordsDialog);
