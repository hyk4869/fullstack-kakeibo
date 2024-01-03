import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useSelector } from 'react-redux';
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import { RootState } from '../../_store/store';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { grey } from '@mui/material/colors';
import NextActionDialog from './nextActionDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExportExampleCSV } from '../../_util/CSV/exportExampleCSV';
import TablePagination from '@mui/material/TablePagination';
import { salaryHeaders } from '../../_util/CSV/exportCSVTitleName';
import {
  Order,
  getComparator,
  incrementFromArray,
  stableSort,
  bonusTaxNullCheck,
  convertBonusyTaxTypes,
} from '@/app/_util/utils';
import useWindowSize from '@/app/_util/useWindowSize';
import { monthlyTaxHeaderList } from '@/app/_util/commonLayouts/headerList';
import { TBonusTax } from '@/app/_store/interfacesInfo';
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
  const [makeNewArray, setMakeNewArray] = useState<Array<TBonusTax>>([]);
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false);
  const [isShowCategoryMaster, setIsShowCategoryMaster] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TBonusTax>('sort');
  const [windowSize, setWindowSize] = useState<boolean>(false);

  const bonusTaxData = useSelector((state: RootState) => state.getBonusTax);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (bonusTaxData && bonusTaxData.length >= 0) {
      const ID: number =
        bonusTaxData.length !== 0 || bonusTaxData !== undefined
          ? bonusTaxData.reduce((maxId, item) => Math.max(maxId, item.sort ?? 0), 1)
          : 1;
      setArrayLastId(ID);
      setIncrement(ID);
    }
  }, [bonusTaxData]);

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
    const incrementIdFromArray = incrementFromArray(makeNewArray, bonusTaxData, incrementArray);

    const lastId = makeNewArray.slice(-1)[0]?.sort;
    if (lastId && incrementIdFromArray === lastId) return;
    const newMonthlySpending = {
      id: '',
      sort: incrementIdFromArray,
      userId: null,
      companyId: null,
      healthInsuranceExpense: null,
      employeePensionInsuranceExpense: null,
      nationalPensionInsuranceExpense: null,
      employeeInsuranceExpense: null,
      longTermCareInsurance: null,
      incomeTax: null,
      residenceTax: null,
      yearEndAdjustment: null,
      notes: null,
    };

    setIncrement(incrementIdFromArray);
    setMakeNewArray((prevArray) => [...prevArray, newMonthlySpending]);
  }, [increment, makeNewArray, incrementArray]);

  /** 削除機能 */
  const deleteValue = useCallback(
    (id: number | null) => {
      if (id === arrayLastId) return;
      const deletedArray = makeNewArray.filter((a) => a.sort !== id);
      setMakeNewArray(deletedArray);

      if (id !== null) {
        const sortedValue = incrementArray.filter((s) => s !== id).map((a) => (a > id ? a - 1 : a));
        setIncrementArray(sortedValue);
        setMakeNewArray((prevId) =>
          prevId.map((a) => {
            return {
              ...a,
              sort: a.sort && a.sort > id ? a.sort - 1 : a.sort,
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
          if (row.sort === id) {
            const updatedRow = { ...row };
            switch (paramKey) {
              case 'sort':
                updatedRow.sort = value === '' ? null : (value as number);
                break;
              case 'companyId':
                updatedRow.companyId = value === '' ? null : (value as number);
                break;
              case 'healthInsuranceExpense':
                updatedRow.healthInsuranceExpense = value === '' ? null : (value as number);
                break;
              case 'employeePensionInsuranceExpense':
                updatedRow.employeePensionInsuranceExpense = value === '' ? null : (value as number);
                break;
              case 'nationalPensionInsuranceExpense':
                updatedRow.nationalPensionInsuranceExpense = value === '' ? null : (value as number);
                break;
              case 'employeeInsuranceExpense':
                updatedRow.employeeInsuranceExpense = value === '' ? null : (value as number);
                break;
              case 'longTermCareInsurance':
                updatedRow.longTermCareInsurance = value === '' ? null : (value as number);
                break;
              case 'incomeTax':
                updatedRow.incomeTax = value === '' ? null : (value as number);
                break;
              case 'residenceTax':
                updatedRow.residenceTax = value === '' ? null : (value as number);
                break;
              case 'yearEndAdjustment':
                updatedRow.yearEndAdjustment = value === '' ? null : (value as number);
                break;
              case 'notes':
                updatedRow.notes = value === '' ? null : (value as number);
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
            reduxArray={bonusTaxData}
            arrayLastId={arrayLastId}
            makeNewArray={makeNewArray}
            addNewArray={addNewArray}
            showDialog={showDialog}
            onCloseAddRecords={onCloseAddRecords}
          />

          <TableContainer sx={{ display: 'flex', justifyContent: 'center', width: '100%', maxHeight: '550px' }}>
            <Table>
              <CommonTableHeader categoryHeaderList={monthlyTaxHeaderList} />

              <TableBody>
                {visibleRows?.map((row) => {
                  return (
                    <TableRow
                      tabIndex={-1}
                      key={Number(row?.sort)}
                      sx={{
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell component="th" id={String(row?.sort)} scope="row?">
                        <CustomNumberFormat
                          value={row?.sort}
                          edit={false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'sort'}
                          id={Number(row?.sort)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row?">
                        <CustomNumberFormat
                          value={row?.companyId}
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'companyId'}
                          id={Number(row?.sort)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row?">
                        <CustomNumberFormat
                          value={row?.healthInsuranceExpense}
                          edit={edit}
                          suffix={' 円'}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'healthInsuranceExpense'}
                          id={Number(row?.sort)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row?">
                        <CustomNumberFormat
                          value={row?.employeePensionInsuranceExpense}
                          edit={edit}
                          suffix={' 円'}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'employeePensionInsuranceExpense'}
                          id={Number(row?.sort)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row?">
                        <CustomNumberFormat
                          value={row?.nationalPensionInsuranceExpense}
                          edit={edit}
                          suffix={' 円'}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'nationalPensionInsuranceExpense'}
                          id={Number(row?.sort)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row?">
                        <CustomNumberFormat
                          value={row?.employeeInsuranceExpense}
                          edit={edit}
                          suffix={' 円'}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'employeeInsuranceExpense'}
                          id={Number(row?.sort)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row?">
                        <CustomNumberFormat
                          value={row?.longTermCareInsurance}
                          edit={edit}
                          suffix={' 円'}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'longTermCareInsurance'}
                          id={Number(row?.sort)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row?">
                        <CustomNumberFormat
                          value={row?.incomeTax}
                          edit={edit}
                          suffix={' 円'}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'incomeTax'}
                          id={Number(row?.sort)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row?">
                        <CustomNumberFormat
                          value={row?.residenceTax}
                          edit={edit}
                          suffix={' 円'}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'residenceTax'}
                          id={Number(row?.sort)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row?">
                        <CustomNumberFormat
                          value={row?.yearEndAdjustment}
                          edit={edit}
                          suffix={' 円'}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'yearEndAdjustment'}
                          id={Number(row?.sort)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row?">
                        <CustomNumberFormat
                          value={row?.notes}
                          edit={edit}
                          suffix={' 円'}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'notes'}
                          id={Number(row?.sort)}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <IconButton onClick={() => deleteValue(row.sort)} disabled={!edit}>
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
          <ExportExampleCSV headerOption={salaryHeaders} />
          <ImportCSV<TBonusTax>
            setMakeNewArray={setMakeNewArray}
            setIncrementArray={setIncrementArray}
            setArrayLastId={setArrayLastId}
            setIncrement={setIncrement}
            convertTypes={convertBonusyTaxTypes}
            nullCheck={bonusTaxNullCheck}
          />
          <Button onClick={() => setIsShowCategoryMaster(true)} variant="outlined">
            カテゴリーIDを参照する
          </Button>
        </Box>

        <NextActionDialog
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
