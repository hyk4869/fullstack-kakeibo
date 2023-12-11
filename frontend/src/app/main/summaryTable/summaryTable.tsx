'use client';

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_store/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { setMonthlySpending } from '../../_store/slice';
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
import LoadingContent from '../../_util/commonLayouts/loading';
import FetchDataDialog from './fetchDataDialog';
import useWindowSize from '@/app/_util/useWindowSize';
import { Order, getComparator, stableSort } from '@/app/_util/utilFunctions';
import { monthlySpendingHeaderList } from '@/app/_util/headerList';
import { TMonthlySpending, MCategory } from '@/app/_store/interfacesInfo';
import CommonEditButton from '@/app/_util/commonLayouts/commonEditButton';
import CommonTDataTableHeader from '@/app/_util/commonLayouts/commonTDataTableHeader';
import useCommonFunctions from '@/app/_util/useCommonFunctions';

export type EnhancedTableToolbarProps = {
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
        title={'クレジットカード明細'}
        setOpenAddContent={() => setOpenAddRecordsDialog(!openAddRecordsDialog)}
        saveValue={saveValue}
        numSelected={numSelected}
        windowSize={windowSize}
        dataLength={dataLength}
        deleteArrayValue={() => deleteArrayValue()}
        enableEdit={enableEdit}
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
  const [maxHeightState, setMaxHeightState] = useState<number>(0);
  const { width, height } = useWindowSize();
  const {
    handleSelectAllClick,
    handleSelect,
    handleChangePage,
    handleChangeRowsPerPage,
    isSelected,
    handleEditFlag,
    handledeleteValue,
    handleDeleteArrayValue,
  } = useCommonFunctions<TMonthlySpending>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (width < 840) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
    if (height > 930) {
      const subtractionHeigh = height * 0.35;
      setMaxHeightState(height - subtractionHeigh);
    } else if (height > 800) {
      const subtractionHeigh = height * 0.4;
      setMaxHeightState(height - subtractionHeigh);
    } else if (height <= 795) {
      const subtractionHeigh = height * 0.5;
      setMaxHeightState(height - subtractionHeigh);
    }
  }, [width, height]);

  useEffect(() => {
    if (monthlyData.length !== editValue.length) {
      setEditValue(monthlyData);
    }
  }, [monthlyData, enableEdit]);

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
            <CommonTDataTableHeader<TMonthlySpending>
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={selectAllClick}
              rowCount={monthlyData.length}
              setOrder={setOrder}
              setOrderBy={setOrderBy}
              labelList={monthlySpendingHeaderList}
            />

            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = row.id !== null ? selectedData(row.id as number) : undefined;
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
                            selectContent(event, row.id as number);
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
                          onClick={() => deleteValue(row.id as number)}
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
          onPageChange={changePage}
          onRowsPerPageChange={changeRowsPerPage}
        />
        <FetchDataDialog openFetchDialog={openFetchDialog} onCloseDialog={() => setOpenFetchDialog(false)} />
      </Paper>
    </Box>
  );
};

export default SummaryTable;
