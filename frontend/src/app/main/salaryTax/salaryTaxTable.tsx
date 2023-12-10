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
import React, { useEffect, useMemo, useState } from 'react';
import { EnhancedTableToolbarProps } from '../summaryTable/summaryTable';
import { TSalaryTax } from '@/app/_store/interfacesInfo';
import { alpha } from '@mui/material/styles';
import CommonTDataTableHeader from '@/app/_util/commonLayouts/commonTDataTableHeader';
import { Order, getComparator, stableSort } from '@/app/_util/utilFunctions';
import { monthlyTaxHeaderList } from '@/app/_util/headerList';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/_store/store';
import { grey } from '@mui/material/colors';
import CommonEditButton from '@/app/_util/commonLayouts/commonEditButton';
import LoadingContent from '../../_util/commonLayouts/loading';
import useWindowSize from '@/app/_util/useWindowSize';
import useCommonFunctions from '@/app/_util/useCommonFunctions';
import axios from 'axios';
import { getSalaryTax } from '@/app/_api/url';
import { setSalaryTaxContent } from '@/app/_store/slice';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import DeleteIcon from '@mui/icons-material/Delete';
import { VariableSizeList } from 'react-window';

export interface HeadCell {
  id: keyof TSalaryTax;
  disablePadding: boolean;
  label: string;
}

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
      <CommonEditButton
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
      />
      {/* <CreateNewRecordsDialog
        openDialog={openAddRecordsDialog}
        onCloseAddRecords={() => setOpenAddRecordsDialog(false)}
        edit={edit}
      /> */}
      <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
    </Toolbar>
  );
};

type SalaryTaxProps = {
  //
};

const SalaryTaxTable: React.FC<SalaryTaxProps> = () => {
  const SalaryTaxData = useSelector((state: RootState) => state.getSalaryTax);
  const companyData = useSelector((state: RootState) => state.getCompanyContent);
  const enableEdit = useSelector((state: RootState) => state.enableEdit);
  const { width, height } = useWindowSize();
  const dispatch = useDispatch();

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TSalaryTax>('id');
  const [selected, setSelected] = useState<number[]>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<Array<TSalaryTax>>([]);
  const [deleteSomething, setDeleteSomething] = useState<Array<TSalaryTax>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const {
    handleSelectAllClick,
    handleSelect,
    handleChangePage,
    handleChangeRowsPerPage,
    isSelected,
    handleEditFlag,
    handledeleteValue,
    handleDeleteArrayValue,
  } = useCommonFunctions<TSalaryTax>();

  useEffect(() => {
    if (width < 840) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width, height]);

  useEffect(() => {
    try {
      if (SalaryTaxData.length === 0) {
        setIsLoading(true);
        axios
          .get(getSalaryTax)
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
  }, [SalaryTaxData]);

  useEffect(() => {
    if (SalaryTaxData.length !== editValue.length) {
      setEditValue(SalaryTaxData);
    }
  }, [SalaryTaxData]);

  /** 全選択のクリック関数 */
  const selectAllClick = (event: React.ChangeEvent<HTMLInputElement>) =>
    handleSelectAllClick(setSelected, editValue, event);

  /** 行または項目の選択に対しての判定 */
  const selectContent = (event: React.MouseEvent<unknown>, id: number) =>
    handleSelect(event, id, setSelected, selected);

  /** ページの移動 */
  const changePage = (event: unknown, newPage: number) => handleChangePage(event, newPage, setPage);

  /** テーブルごとの表示数 */
  const changeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) =>
    handleChangeRowsPerPage(event, setRowsPerPage, setPage);

  /** 要素の選択 */
  const selectedData = (id: number) => isSelected(id, selected);

  /** edit関数 */
  const editFlag = () => handleEditFlag(setEdit);

  /** 削除 */
  const deleteValue = (id: number) => handledeleteValue(id, setEditValue, setDeleteSomething);

  /** 一括削除 */
  const deleteArrayValue = () => handleDeleteArrayValue(setEditValue, setDeleteSomething, setSelected, selected);

  /**
   * テーブルやリストの表示に必要なデータを計算し、最適化
   */
  const visibleRows = useMemo(
    () =>
      stableSort(editValue, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, editValue],
  );
  const changeValue = () => {};
  const saveValue = async () => {};

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '95%', margin: '1rem auto', background: grey[50] }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            edit={edit}
            dataLength={SalaryTaxData.length}
            handleEditFlag={editFlag}
            saveValue={saveValue}
            deleteArrayValue={deleteArrayValue}
            enableEdit={enableEdit}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            windowSize={windowSize}
          />
          <TableContainer>
            <Table>
              <CommonTDataTableHeader<TSalaryTax>
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={selectAllClick}
                rowCount={SalaryTaxData.length}
                setOrder={setOrder}
                setOrderBy={setOrderBy}
                labelList={monthlyTaxHeaderList}
              />
              <TableBody>
                {visibleRows.map((a, idx) => {
                  const isItemSelected = a.id !== null ? selectedData(a.id as number) : undefined;
                  const labelId = `enhanced-table-checkbox-${idx}`;
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={a.id} sx={{ cursor: 'pointer' }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                          onClick={(event) => {
                            if (a.id !== null) {
                              selectContent(event, a.id as number);
                            }
                          }}
                        />
                      </TableCell>

                      <Tooltip title={'idを変更することはできません'} arrow>
                        <TableCell component="th" id={labelId} scope="row">
                          <CustomNumberFormat
                            value={a.id}
                            edit={false}
                            align="center"
                            onChangeValue={changeValue}
                            paramKey={'id'}
                            id={Number(a.id)}
                          />
                        </TableCell>
                      </Tooltip>

                      <Tooltip title={companyData.find((s) => s.id === a.companyId)?.name} arrow>
                        <TableCell align="center" sx={{ padding: commonPadding5 }}>
                          <CustomNumberFormat
                            value={a.companyId}
                            edit={edit}
                            align="center"
                            onChangeValue={changeValue}
                            paramKey={'companyId'}
                            id={Number(a.id)}
                          />
                        </TableCell>
                      </Tooltip>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.healthInsuranceExpense}
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'healthInsuranceExpense'}
                          id={Number(a.id)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.employeePensionInsuranceExpense}
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'employeePensionInsuranceExpense'}
                          id={Number(a.id)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.nationalPensionInsuranceExpense}
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'nationalPensionInsuranceExpense'}
                          id={Number(a.id)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.employeeInsuranceExpense}
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'employeeInsuranceExpense'}
                          id={Number(a.id)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.longTermCareInsurance}
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'longTermCareInsurance'}
                          id={Number(a.id)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.incomeTax}
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'incomeTax'}
                          id={Number(a.id)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.residenceTax}
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'residenceTax'}
                          id={Number(a.id)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.yearEndAdjustment}
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'yearEndAdjustment'}
                          id={Number(a.id)}
                          suffix={'円'}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.notes}
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'notes'}
                          id={Number(a.id)}
                          suffix={'円'}
                        />
                      </TableCell>

                      {edit ? (
                        <TableCell align="center">
                          <DeleteIcon
                            onClick={() => deleteValue(a.id as number)}
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
            count={SalaryTaxData.length}
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