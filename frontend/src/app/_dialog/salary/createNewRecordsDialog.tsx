import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useSelector } from 'react-redux';
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import CustomDate from '../../_customComponents/customDate';
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
  salaryNullCheck,
  convertSalaryTypes,
} from '@/app/_util/utils';
import useWindowSize from '@/app/_util/useWindowSize';
import { saLaryHeaderList } from '@/app/_util/commonLayouts/headerList';
import { TSalary } from '@/app/_store/interfacesInfo';
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
  const [makeNewArray, setMakeNewArray] = useState<Array<TSalary>>([]);
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false);
  const [isShowCategoryMaster, setIsShowCategoryMaster] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TSalary>('id');
  const [windowSize, setWindowSize] = useState<boolean>(false);

  const salaryData = useSelector((state: RootState) => state.getSalary);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (salaryData && salaryData.length >= 0) {
      const ID: number =
        salaryData.length !== 0 || salaryData !== undefined
          ? salaryData.reduce((maxId, item) => Math.max(maxId, item.id ?? 0), 1)
          : 1;
      setArrayLastId(ID);
      setIncrement(ID);
    }
  }, [salaryData]);

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
    const incrementIdFromArray = incrementFromArray(makeNewArray, salaryData, incrementArray);

    const lastId = makeNewArray.slice(-1)[0]?.id;
    if (lastId && incrementIdFromArray === lastId) return;
    const newMonthlySpending = {
      id: incrementIdFromArray,
      userId: null,
      payday: null,
      salary: null,
      companyId: null,
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
              case 'companyId':
                updatedRow.companyId = value === '' ? null : (value as number);
                break;
              case 'payday':
                updatedRow.payday = value === '' ? null : (value as Date);
                break;
              case 'salary':
                updatedRow.salary = value === '' ? null : (value as number);
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
            reduxArray={salaryData}
            arrayLastId={arrayLastId}
            makeNewArray={makeNewArray}
            addNewArray={addNewArray}
            showDialog={showDialog}
            onCloseAddRecords={onCloseAddRecords}
          />

          <TableContainer sx={{ display: 'flex', justifyContent: 'center', width: '100%', maxHeight: '550px' }}>
            <Table>
              <CommonTableHeader categoryHeaderList={saLaryHeaderList} />

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

                      <TableCell component="th" scope="row?">
                        <CustomNumberFormat
                          value={row?.companyId}
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'companyId'}
                          id={Number(row?.id)}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <CustomDate
                          value={dayjs(row?.payday)}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'payday'}
                          id={Number(row?.id)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row?">
                        <CustomNumberFormat
                          value={row?.salary}
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'salary'}
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
          <ImportCSV<TSalary>
            setMakeNewArray={setMakeNewArray}
            setIncrementArray={setIncrementArray}
            setArrayLastId={setArrayLastId}
            setIncrement={setIncrement}
            convertTypes={convertSalaryTypes}
            nullCheck={salaryNullCheck}
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
        {/* <ShowCategoryMaster
          isShowCategoryMaster={isShowCategoryMaster}
          onCloseCategoryMaster={() => setIsShowCategoryMaster(false)}
        /> */}
      </Dialog>
    </Box>
  );
};

export default React.memo(CreateNewRecordsDialog);
