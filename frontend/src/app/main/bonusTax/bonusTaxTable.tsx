'use client';

import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Tooltip,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TBonusTax } from '@/app/_store/interfacesInfo';
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
import { getBonusTax, postDeleteBonusTax } from '@/app/_api/url';
import { setBonusTaxContent } from '@/app/_store/slice';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import CommonEditDeleteIcon from '@/app/_util/commonLayouts/commonEditDeleteIcon';
import CreateNewRecordsDialog from '@/app/_dialog/bonusTax/createNewRecordsDialog';
import FetchDataDialog from '@/app/_util/commonDialog/fetchDataDialog';
import { ExportCSVData } from '@/app/_util/CSV/exportCSVData';

type BonusTaxProps = {
  //
};

const BonusTaxTable: React.FC<BonusTaxProps> = () => {
  const bonusTaxData = useSelector((state: RootState) => state.getBonusTax);
  const companyData = useSelector((state: RootState) => state.getCompanyContent);
  const enableEdit = useSelector((state: RootState) => state.enableEdit);
  const user = useSelector((state: RootState) => state.getUserInfo);
  const heightValue = useSelector((state: RootState) => state.headerHeightSlice);

  const { width, height } = useWindowSize();
  const dispatch = useDispatch();

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TBonusTax>('sort');
  const [selected, setSelected] = useState<number[]>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<Array<TBonusTax>>([]);
  const [deleteSomething, setDeleteSomething] = useState<Array<TBonusTax>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [rowNumber, setRowNumber] = useState<number>(0);

  const [openAddRecordsDialog, setOpenAddRecordsDialog] = useState<boolean>(false);
  const [openFetchDialog, setOpenFetchDialog] = useState<boolean>(false);

  const utilMethods = useCommonFunctions<TBonusTax>();

  const formatedData = [...bonusTaxData]
    ?.sort((a, b) => {
      if (a.sort !== null && b.sort !== null) {
        return a.sort - b.sort;
      } else {
        return 0;
      }
    })
    .map(({ id, MCompany, TBonus, companyId, ...data }) => {
      return { ...data };
    });

  const csv = new ExportCSVData({ fileName: 'TBonusTax', file: formatedData, availableDate: true });

  console.log(bonusTaxData);

  useEffect(() => {
    if (width < 840) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width, height]);

  useEffect(() => {
    if (bonusTaxData.length !== editValue.length) {
      setEditValue(bonusTaxData);
    }
  }, [bonusTaxData]);

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

  const postData = editValue.map(({ TBonus, MCompany, ...a }) => ({
    ...a,
    userId: user.userID,
  }));
  const deleteData = deleteSomething.map(({ TBonus, MCompany, ...a }) => ({
    ...a,
    userId: user.userID,
  }));

  /**
   * 保存
   */
  const saveValue = () =>
    utilMethods.handleSaveValue(
      dispatch,
      postData,
      deleteData,
      getBonusTax,
      postDeleteBonusTax,
      setBonusTaxContent,
      setIsLoading,
      setEdit,
      setDeleteSomething,
    );

  return (
    <>
      <Box sx={{ width: '100%', position: 'relative', top: `calc(${heightValue}px * (1 + 0.1))` }}>
        <Paper sx={{ width: '95%', margin: '1rem auto', background: grey[50] }}>
          <Box>
            <CommonTopEditButton
              edit={edit}
              handleEditFlag={editFlag}
              title={'賞与に対する税金関係'}
              setOpenAddContent={() => setOpenAddRecordsDialog(!openAddRecordsDialog)}
              saveValue={saveValue}
              numSelected={selected.length}
              windowSize={windowSize}
              dataLength={bonusTaxData.length}
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
            <FetchDataDialog
              openFetchDialog={openFetchDialog}
              onCloseDialog={() => setOpenFetchDialog(false)}
              setReduxValue={(payload: unknown[]) => setBonusTaxContent(payload as TBonusTax[])}
              reduxValue={bonusTaxData!}
              api={getBonusTax}
            />
          </Box>

          <TableContainer sx={{ height: `calc(100vh * (1 - 0.26) - ${heightValue}px)` }}>
            <Table stickyHeader aria-label="sticky table">
              <CommonTDataTableHeader<TBonusTax>
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={selectAllClick}
                rowCount={bonusTaxData.length}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem' }}>
            <Button variant="outlined" onClick={() => csv.createCSVFile()} disabled={bonusTaxData.length === 0}>
              CSVダウンロード
            </Button>

            <TablePagination
              rowsPerPageOptions={[20, 50, 75]}
              component="div"
              count={bonusTaxData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={changePage}
              onRowsPerPageChange={changeRowsPerPage}
            />
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default React.memo(BonusTaxTable);
