import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useSelector } from 'react-redux';
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import CustomDate from '../../_customComponents/customDate';
import CustomSelectTab from '../../_customComponents/customSelectTab';
import CustomTextfield from '../../_customComponents/customTextfield';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import { RootState } from '../../_store/store';
import dayjs from 'dayjs';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { grey } from '@mui/material/colors';
import MonthlyNextActionDialog from './nextActionDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExportExampleCSV } from '../../_util/CSV/exportExampleCSV';
import { ShowCategoryMaster } from './showCategory';
import TablePagination from '@mui/material/TablePagination';
import { monthlySpendingHeaders } from '../../_util/CSV/exportCSVTitleName';
import {
  Order,
  getComparator,
  incrementFromArray,
  stableSort,
  convertMonthlySpendingTypes,
  monthlySpendingNullCheck,
} from '@/app/_util/utils';
import useWindowSize from '@/app/_util/useWindowSize';
import { monthlySpendingHeaderList } from '@/app/_util/commonLayouts/headerList';
import { TMonthlySpending, MCategory } from '@/app/_store/interfacesInfo';
import { ImportCSV } from '@/app/_util/CSV/importCSV';
import { CommonEditButton } from '../commonContent/commonEditButton';
import CommonTableHeader from '@/app/_util/commonLayouts/commonTableHeader';

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
  const [windowSize, setWindowSize] = useState<boolean>(false);

  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);
  const { width, height } = useWindowSize();

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

  useEffect(() => {
    if (width < 640) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width]);

  /** 新しいレコードの追加 */
  const addNewArray = useCallback(() => {
    const incrementIdFromArray = incrementFromArray(makeNewArray, monthlyData, incrementArray);

    const lastId = makeNewArray.slice(-1)[0]?.id;
    if (lastId && incrementIdFromArray === lastId) return;
    const newMonthlySpending = {
      id: incrementIdFromArray,
      userId: null,
      paymentDay: null,
      store: '',
      usageFee: null,
      categoryId: null,
    };

    setIncrement(incrementIdFromArray);
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

  /** 次へ進むためのboolean */
  const showDialog = () => {
    setIsShowDialog(!isShowDialog);
  };

  const visibleRows = useMemo(
    () =>
      stableSort(makeNewArray, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, makeNewArray],
  );

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
          <CommonEditButton
            reduxArray={monthlyData}
            arrayLastId={arrayLastId}
            makeNewArray={makeNewArray}
            addNewArray={addNewArray}
            showDialog={showDialog}
            onCloseAddRecords={onCloseAddRecords}
          />

          <TableContainer sx={{ display: 'flex', justifyContent: 'center', width: '100%', maxHeight: '550px' }}>
            <Table>
              <CommonTableHeader categoryHeaderList={monthlySpendingHeaderList} />

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
                            return { value: Number(a.id), label: String(a.categoryName) };
                          })}
                          value={categoryData.find((a) => a.id === row?.categoryId)?.id ?? null}
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
                        <IconButton onClick={() => deleteValue(row.id)} disabled={!edit}>
                          <DeleteIcon sx={{ cursor: 'pointer', opacity: '0.4', '&:hover': { opacity: '1' } }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            margin: '1rem auto',
            width: '95%',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: windowSize ? 'column' : 'row',
          }}
        >
          <ExportExampleCSV headerOption={monthlySpendingHeaders} />
          <ImportCSV<TMonthlySpending>
            setMakeNewArray={setMakeNewArray}
            setIncrementArray={setIncrementArray}
            setArrayLastId={setArrayLastId}
            setIncrement={setIncrement}
            convertTypes={convertMonthlySpendingTypes}
            nullCheck={monthlySpendingNullCheck}
          />
          <Button onClick={() => setIsShowCategoryMaster(true)} variant="outlined">
            カテゴリーIDを参照する
          </Button>
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
