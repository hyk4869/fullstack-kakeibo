'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_store/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { setMonthlySpending } from '../../_store/slice';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import CustomTextfield from '../../_customComponents/customTextfield';
import CustomDate from '../../_customComponents/customDate';
import CustomSelectTab from '../../_customComponents/customSelectTab';
import dayjs from 'dayjs';
import CreateNewRecordsDialog from '../../_dialog/monthlySpending/createNewRecordsDialog';
import { grey } from '@mui/material/colors';
import { getMonthlySpending, postDeleteMonthlySpending } from '../../_api/url';
import LoadingContent from '../../_util/commonLayouts/loading';
import FetchDataDialog from './fetchDataDialog';
import useWindowSize from '@/app/_util/useWindowSize';
import { Order, getComparator, stableSort } from '@/app/_util/utils';
import { monthlySpendingHeaderList } from '@/app/_util/commonLayouts/headerList';
import { TMonthlySpending, MCategory } from '@/app/_store/interfacesInfo';
import CommonTopEditButton from '@/app/_util/commonLayouts/commonTopEditButton';
import CommonTDataTableHeader from '@/app/_util/commonLayouts/commonTDataTableHeader';
import useCommonFunctions from '@/app/_util/useCommonFunctions';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import CommonEditDeleteIcon from '@/app/_util/commonLayouts/commonEditDeleteIcon';
import { ExportCSVData } from '@/app/_util/CSV/exportCSVData';
import CommonTableFooter from '@/app/_util/commonFooter/commonTableFooter';

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
  const user = useSelector((state: RootState) => state.getUserInfo);
  const heightValue = useSelector((state: RootState) => state.headerHeightSlice);

  const { width, height } = useWindowSize();
  const dispatch = useDispatch();

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TMonthlySpending>('sort');
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [edit, setEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<Array<TMonthlySpending>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteSomething, setDeleteSomething] = useState<Array<TMonthlySpending>>([]);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [rowNumber, setRowNumber] = useState<number>(0);

  const [editLogValue, setEditLogValue] = useState<Array<TMonthlySpending>>([]);

  const [openAddRecordsDialog, setOpenAddRecordsDialog] = useState<boolean>(false);
  const [openFetchDialog, setOpenFetchDialog] = useState<boolean>(false);

  const utilMethods = useCommonFunctions<TMonthlySpending>();

  const formatedData = [...monthlyData]
    ?.sort((a, b) => {
      if (a.sort !== null && b.sort !== null) {
        return a.sort - b.sort;
      } else {
        return 0;
      }
    })
    .map(({ category, id, categoryId, ...data }) => {
      return { ...data, paymentDay: dayjs(data.paymentDay).format('YYYY-MM-DD') };
    });

  const csv = new ExportCSVData({ fileName: 'TMonthlySpending', file: formatedData, availableDate: true });

  useEffect(() => {
    if (width < 840) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width, height]);

  useEffect(() => {
    if (monthlyData.length !== editValue.length) {
      if (editLogValue.length !== 0) {
        const updatedEditValue: TMonthlySpending[] = monthlyData.map((row) => {
          const logRow = editLogValue.find((log) => log.sort === row.sort);
          return logRow ? { ...row, ...logRow } : row;
        });
        setEditValue(updatedEditValue);
      } else {
        setEditValue(monthlyData);
      }
    }
  }, [monthlyData, enableEdit]);

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

  /** listのメモ化 */
  const generateCategoryList = useCallback(() => {
    return categoryData.map((a: MCategory) => ({
      value: Number(a.sort),
      label: String(a.categoryName),
    }));
  }, [categoryData]);

  /** 値の編集用 */
  const changeValue = useCallback(
    (id: number, paramKey: string, value: unknown) => {
      setEditValue((prevArray) => {
        return prevArray.map((row) => {
          if (row.sort === id) {
            const updatedRow = { ...row };
            switch (paramKey) {
              case 'sort':
                updatedRow.sort = value === '' ? null : (value as number);
                break;
              case 'paymentDay':
                updatedRow.paymentDay = value === '' ? null : (value as Date);
                break;
              case 'store':
                updatedRow.store = value === '' ? null : (value as string);
                break;
              case 'categoryId':
                updatedRow.categoryId = value === '' ? null : (value as string);
                break;
              case 'categorySort':
                updatedRow.categorySort = value === '' ? null : (value as number);
                break;
              case 'usageFee':
                updatedRow.usageFee = value === '' ? null : parseFloat(value as string);
                break;
            }

            setEditLogValue((prev) => {
              /** 最初の一致する要素が削除され、新しい要素 updatedRow が配列の末尾に追加される */
              const filteredArray = prev.filter((a) => a.sort !== updatedRow.sort);
              return [...filteredArray, updatedRow];
            });

            return updatedRow;
          } else {
            return row;
          }
        });
      });
    },
    [editValue, editLogValue],
  );

  const postData = editLogValue.map(({ category, ...data }) => ({
    ...data,
    userId: user.userID,
  }));
  const deleteData = deleteSomething.map(({ category, ...data }) => ({
    ...data,
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
      getMonthlySpending,
      postDeleteMonthlySpending,
      setMonthlySpending,
      setIsLoading,
      setEdit,
      setDeleteSomething,
    );

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
    <Box sx={{ width: '100%', position: 'relative', top: `calc(${heightValue}px * (1 + 0.1))` }}>
      <Paper
        sx={{
          width: '95%',
          margin: '1rem auto',
          background: grey[50],
        }}
      >
        <Box>
          <CommonTopEditButton
            edit={edit}
            handleEditFlag={editFlag}
            title={'クレジットカード明細'}
            setOpenAddContent={() => setOpenAddRecordsDialog(!openAddRecordsDialog)}
            saveValue={saveValue}
            numSelected={selected.length}
            windowSize={windowSize}
            dataLength={monthlyData.length}
            deleteArrayValue={() => deleteArrayValue()}
            enableEdit={enableEdit}
            setOpenFetchDialog={() => setOpenFetchDialog(true)}
          />
          <CreateNewRecordsDialog
            openDialog={openAddRecordsDialog}
            onCloseAddRecords={() => setOpenAddRecordsDialog(false)}
            edit={edit}
            setEditLogValue={setEditLogValue}
          />
          <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
          <FetchDataDialog
            openFetchDialog={openFetchDialog}
            onCloseDialog={() => setOpenFetchDialog(false)}
            windowSize={windowSize}
          />
        </Box>

        <TableContainer sx={{ height: `calc(100vh * (1 - 0.26) - ${heightValue}px)` }}>
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
                const isItemSelected = row.sort !== null ? selectedData(row.sort as number) : undefined;
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.sort} sx={{ cursor: 'pointer' }}>
                    <TableCell padding="checkbox" sx={{ padding: commonPadding5 }}>
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                        onClick={(event) => {
                          if (row.sort !== null) {
                            selectContent(event, row.sort as number);
                          }
                        }}
                      />
                    </TableCell>
                    <Tooltip title={'idを変更することはできません'} arrow>
                      <TableCell component="th" id={labelId} scope="row" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={row.sort}
                          edit={false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'sort'}
                          id={Number(row.sort)}
                        />
                      </TableCell>
                    </Tooltip>
                    <TableCell align="center" sx={{ padding: commonPadding5 }}>
                      <CustomDate
                        value={dayjs(row.paymentDay)}
                        edit={row.sort === rowNumber ? isEditable : false}
                        onChangeValue={changeValue}
                        paramKey={'paymentDay'}
                        id={Number(row.sort)}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ padding: commonPadding5 }}>
                      <CustomTextfield
                        value={row.store}
                        edit={row.sort === rowNumber ? isEditable : false}
                        onChangeValue={changeValue}
                        paramKey={'store'}
                        id={Number(row.sort)}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ padding: commonPadding5 }}>
                      <CustomSelectTab
                        list={generateCategoryList()}
                        value={categoryData.find((a) => a.sort === row.categorySort)?.sort ?? null}
                        edit={row.sort === rowNumber ? isEditable : false}
                        paramKey={'categorySort'}
                        id={Number(row?.sort)}
                        onChangeValue={changeValue}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ padding: commonPadding5 }}>
                      <CustomNumberFormat
                        value={row.usageFee}
                        suffix=" 円"
                        edit={row.sort === rowNumber ? isEditable : false}
                        align="center"
                        onChangeValue={changeValue}
                        paramKey={'usageFee'}
                        id={Number(row.sort)}
                      />
                    </TableCell>

                    <CommonEditDeleteIcon
                      individualEdit={() => individualEdit(row.sort as number)}
                      deleteValue={() => deleteValue(row.sort as number)}
                      edit={edit}
                    />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <CommonTableFooter
          createCSVFile={() => csv.createCSVFile()}
          arrayLength={monthlyData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          changePage={changePage}
          changeRowsPerPage={changeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default SummaryTable;
