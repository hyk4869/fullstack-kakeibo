'use client';

import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Tooltip,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EnhancedTableToolbarProps } from '../summaryTable/summaryTable';
import { TSalaryTax } from '@/app/_store/interfacesInfo';
import { alpha } from '@mui/material/styles';
import CommonTDataTableHeader from '@/app/_util/commonLayouts/commonTDataTableHeader';
import { Order, getComparator, stableSort } from '@/app/_util/utils';
import { monthlyTaxHeaderList } from '@/app/_util/commonLayouts/headerList';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/_store/store';
import { grey } from '@mui/material/colors';
import CommonTopEditButton from '@/app/_util/commonLayouts/commonTopEditButton';
import LoadingContent from '../../_util/commonLayouts/loading';
import useWindowSize from '@/app/_util/useWindowSize';
import useCommonFunctions from '@/app/_util/useCommonFunctions';
import axios from 'axios';
import { getSalaryTax, postDeleteSalaryTax } from '@/app/_api/url';
import { setSalaryTaxContent } from '@/app/_store/slice';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import CommonEditDeleteIcon from '@/app/_util/commonLayouts/commonEditDeleteIcon';
import CreateNewRecordsDialog from '@/app/_dialog/salaryTax/createNewRecordsDialog';
import Cookies from 'js-cookie';

/** 上のeditボタン */
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
  const [openFetchDialog, setOpenFetchDialog] = useState<boolean>(false);

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
      <CommonTopEditButton
        edit={edit}
        handleEditFlag={handleEditFlag}
        title={'給与に対する税金関係'}
        setOpenAddContent={() => setOpenAddRecordsDialog(!openAddRecordsDialog)}
        saveValue={saveValue}
        numSelected={numSelected}
        windowSize={windowSize}
        dataLength={dataLength}
        deleteArrayValue={() => deleteArrayValue()}
        enableEdit={enableEdit}
        setOpenFetchDialog={() => setOpenFetchDialog(true)}
      />
      <CreateNewRecordsDialog
        openDialog={openAddRecordsDialog}
        onCloseAddRecords={() => setOpenAddRecordsDialog(false)}
        edit={edit}
      />
      <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
    </Toolbar>
  );
};

type SalaryTaxProps = {
  //
};

const SalaryTaxTable: React.FC<SalaryTaxProps> = () => {
  const salaryTaxData = useSelector((state: RootState) => state.getSalaryTax);
  const companyData = useSelector((state: RootState) => state.getCompanyContent);
  const enableEdit = useSelector((state: RootState) => state.enableEdit);
  const user = useSelector((state: RootState) => state.getUserInfo);

  const { width, height } = useWindowSize();
  const dispatch = useDispatch();

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TSalaryTax>('sort');
  const [selected, setSelected] = useState<number[]>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<Array<TSalaryTax>>([]);
  const [deleteSomething, setDeleteSomething] = useState<Array<TSalaryTax>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [maxHeightState, setMaxHeightState] = useState<number>(0);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [rowNumber, setRowNumber] = useState<number>(0);

  const utilMethods = useCommonFunctions<TSalaryTax>();

  const jwtToken = Cookies.get('authToken');

  useEffect(() => {
    if (width < 840) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
    if (height > 930) {
      const subtractionHeigh = height * 0.3;
      setMaxHeightState(height - subtractionHeigh);
    } else if (height > 800) {
      const subtractionHeigh = height * 0.35;
      setMaxHeightState(height - subtractionHeigh);
    } else if (height <= 795) {
      const subtractionHeigh = height * 0.5;
      setMaxHeightState(height - subtractionHeigh);
    }
  }, [width, height]);

  useEffect(() => {
    try {
      if (salaryTaxData.length === 0) {
        setIsLoading(true);
        axios
          .get(getSalaryTax, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            params: {
              userID: user.userID,
            },
          })
          .then((res) => {
            if (res.data) {
              dispatch(setSalaryTaxContent(res.data));
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } catch (error) {
      console.error(error);
    }
    //TODO: 無限レンダリングしているため、第二引数は取っているが、検討が必要
  }, []);

  useEffect(() => {
    if (salaryTaxData.length !== editValue.length) {
      setEditValue(salaryTaxData);
    }
  }, [salaryTaxData]);

  /** 全選択のクリック関数 */
  const selectAllClick = (event: React.ChangeEvent<HTMLInputElement>) =>
    utilMethods.handleSelectAllClick(setSelected, editValue, event);

  /** 行または項目の選択に対しての判定 */
  const selectContent = (event: React.MouseEvent<unknown>, id: number) =>
    utilMethods.handleSelect(event, id, setSelected, selected);

  /** ページの移動 */
  const changePage = (event: unknown, newPage: number) => utilMethods.handleChangePage(event, newPage, setPage);

  /** テーブルごとの表示数 */
  const changeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) =>
    utilMethods.handleChangeRowsPerPage(event, setRowsPerPage, setPage);

  /** 要素の選択 */
  const selectedData = (id: number) => utilMethods.isSelected(id, selected);

  /** edit関数 */
  const editFlag = () => utilMethods.handleEditFlag(setEdit);

  /** 削除 */
  const deleteValue = (id: number) => utilMethods.handledeleteValue(id, setEditValue, setDeleteSomething);

  /** 一括削除 */
  const deleteArrayValue = () =>
    utilMethods.handleDeleteArrayValue(setEditValue, setDeleteSomething, setSelected, selected);

  /** 個別のedit関数 */
  const individualEdit = (id: number) => utilMethods.handleIndividualEdit(id, editValue, setRowNumber, setIsEditable);

  /**
   * テーブルやリストの表示に必要なデータを計算し、最適化
   */
  const visibleRows = useMemo(
    () =>
      stableSort(editValue, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, editValue],
  );

  const changeValue = useCallback(
    (id: number, paramKey: string, value: unknown) => {
      setEditValue((prevValue) => {
        return prevValue.map((a) => {
          if (a.sort === id) {
            const updateValue = { ...a };
            switch (paramKey) {
              case 'sort':
                updateValue.sort = value === '' ? null : (value as number);
                break;
              case 'userId':
                updateValue.userId = value === '' ? null : (value as string);
                break;
              case 'companyId':
                updateValue.companyId = value === '' ? null : (value as string);
                break;
              case 'companyNum':
                updateValue.companyNum = value === '' ? null : (value as number);
                break;
              case 'healthInsuranceExpense':
                updateValue.healthInsuranceExpense = value === '' ? null : parseFloat(value as string);
                break;
              case 'employeePensionInsuranceExpense':
                updateValue.employeePensionInsuranceExpense = value === '' ? null : parseFloat(value as string);
                break;
              case 'nationalPensionInsuranceExpense':
                updateValue.nationalPensionInsuranceExpense = value === '' ? null : parseFloat(value as string);
                break;
              case 'employeeInsuranceExpense':
                updateValue.employeeInsuranceExpense = value === '' ? null : parseFloat(value as string);
                break;
              case 'longTermCareInsurance':
                updateValue.longTermCareInsurance = value === '' ? null : parseFloat(value as string);
                break;
              case 'incomeTax':
                updateValue.incomeTax = value === '' ? null : parseFloat(value as string);
                break;
              case 'residenceTax':
                updateValue.residenceTax = value === '' ? null : parseFloat(value as string);
                break;
              case 'yearEndAdjustment':
                updateValue.yearEndAdjustment = value === '' ? null : parseFloat(value as string);
                break;
              case 'notes':
                updateValue.notes = value === '' ? null : parseFloat(value as string);
                break;
            }
            return updateValue;
          } else {
            return a;
          }
        });
      });
    },
    [editValue],
  );

  const saveValue = async () => {
    setIsLoading(true);
    const postData = editValue.map((a) => ({
      ...a,
      userId: user.userID,
    }));
    const deleteData = deleteSomething.map((a) => ({
      ...a,
      userId: user.userID,
    }));
    await axios
      .post(getSalaryTax, postData, { headers: { Authorization: `Bearer ${jwtToken}` } })
      .then((res) => {
        if (res.data) {
          dispatch(setSalaryTaxContent(res.data));
        }
      })
      .catch((error) => {
        console.error(error);
      });
    if (deleteData.length !== 0) {
      await axios
        .post(postDeleteSalaryTax, deleteData, { headers: { Authorization: `Bearer ${jwtToken}` } })
        .then((res) => {
          if (res.data) {
            dispatch(setSalaryTaxContent(res.data));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    setIsLoading(false);
    setEdit(false);
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '95%', margin: '1rem auto', background: grey[50] }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            edit={edit}
            dataLength={salaryTaxData.length}
            handleEditFlag={editFlag}
            saveValue={saveValue}
            deleteArrayValue={deleteArrayValue}
            enableEdit={enableEdit}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            windowSize={windowSize}
          />
          <TableContainer sx={{ maxHeight: `${maxHeightState}px` }}>
            <Table stickyHeader aria-label="sticky table">
              <CommonTDataTableHeader<TSalaryTax>
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={selectAllClick}
                rowCount={salaryTaxData.length}
                setOrder={setOrder}
                setOrderBy={setOrderBy}
                labelList={monthlyTaxHeaderList}
              />
              <TableBody>
                {visibleRows.map((a, idx) => {
                  const isItemSelected = a.sort !== null ? selectedData(a.sort as number) : undefined;
                  const labelId = `enhanced-table-checkbox-${idx}`;
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={a.sort} sx={{ cursor: 'pointer' }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                          onClick={(event) => {
                            if (a.sort !== null) {
                              selectContent(event, a.sort as number);
                            }
                          }}
                        />
                      </TableCell>

                      <Tooltip title={'idを変更することはできません'} arrow>
                        <TableCell component="th" id={labelId} scope="row">
                          <CustomNumberFormat
                            value={a.sort}
                            edit={false}
                            align="center"
                            onChangeValue={changeValue}
                            paramKey={'sort'}
                            id={Number(a.sort)}
                          />
                        </TableCell>
                      </Tooltip>

                      <Tooltip title={companyData.find((s) => s.id === a.companyNum)?.name} arrow>
                        <TableCell align="center" sx={{ padding: commonPadding5 }}>
                          <CustomNumberFormat
                            value={a.companyNum}
                            edit={a.sort === rowNumber ? isEditable : false}
                            align="center"
                            onChangeValue={changeValue}
                            paramKey={'companyNum'}
                            id={Number(a.sort)}
                          />
                        </TableCell>
                      </Tooltip>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.healthInsuranceExpense}
                          edit={a.sort === rowNumber ? isEditable : false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'healthInsuranceExpense'}
                          id={Number(a.sort)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.employeePensionInsuranceExpense}
                          edit={a.sort === rowNumber ? isEditable : false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'employeePensionInsuranceExpense'}
                          id={Number(a.sort)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.nationalPensionInsuranceExpense}
                          edit={a.sort === rowNumber ? isEditable : false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'nationalPensionInsuranceExpense'}
                          id={Number(a.sort)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.employeeInsuranceExpense}
                          edit={a.sort === rowNumber ? isEditable : false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'employeeInsuranceExpense'}
                          id={Number(a.sort)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.longTermCareInsurance}
                          edit={a.sort === rowNumber ? isEditable : false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'longTermCareInsurance'}
                          id={Number(a.sort)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.incomeTax}
                          edit={a.sort === rowNumber ? isEditable : false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'incomeTax'}
                          id={Number(a.sort)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.residenceTax}
                          edit={a.sort === rowNumber ? isEditable : false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'residenceTax'}
                          id={Number(a.sort)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.yearEndAdjustment}
                          edit={a.sort === rowNumber ? isEditable : false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'yearEndAdjustment'}
                          id={Number(a.sort)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.notes}
                          edit={a.sort === rowNumber ? isEditable : false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'notes'}
                          id={Number(a.sort)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <CommonEditDeleteIcon
                        individualEdit={() => individualEdit(a.sort as number)}
                        deleteValue={() => deleteValue(a.sort as number)}
                        edit={edit}
                      />
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[20, 50, 75]}
            component="div"
            count={salaryTaxData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={changePage}
            onRowsPerPageChange={changeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
};

export default React.memo(SalaryTaxTable);
