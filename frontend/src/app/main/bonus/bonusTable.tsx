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
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EnhancedTableToolbarProps } from '../summaryTable/summaryTable';
import CommonTopEditButton from '@/app/_util/commonLayouts/commonTopEditButton';
import { alpha } from '@mui/material/styles';
import LoadingContent from '../../_util/commonLayouts/loading';
import { grey } from '@mui/material/colors';
import { Order, getComparator, stableSort } from '@/app/_util/utils';
import useWindowSize from '@/app/_util/useWindowSize';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/_store/store';
import useCommonFunctions from '@/app/_util/useCommonFunctions';
import { TBonus } from '@/app/_store/interfacesInfo';
import CommonTDataTableHeader from '@/app/_util/commonLayouts/commonTDataTableHeader';
import { saLaryHeaderList } from '@/app/_util/commonLayouts/headerList';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import CustomDate from '@/app/_customComponents/customDate';
import dayjs from 'dayjs';
import CommonEditDeleteIcon from '@/app/_util/commonLayouts/commonEditDeleteIcon';
import axios from 'axios';
import { setBonusContent, setCreateBonus } from '@/app/_store/slice';
import { getBonus, postDeleteBonus } from '@/app/_api/url';
import Cookies from 'js-cookie';
import CreateNewRecordsDialog from '@/app/_dialog/bonus/createNewRecordsDialog';

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
        title={'賞与明細'}
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
      {/* <FetchDataDialog openFetchDialog={openFetchDialog} onCloseDialog={() => setOpenFetchDialog(false)} /> */}
    </Toolbar>
  );
};

type BonusTableProps = {
  //
};

const BonusTable: React.FC<BonusTableProps> = () => {
  const bonusData = useSelector((state: RootState) => state.getBonus);
  const enableEdit = useSelector((state: RootState) => state.enableEdit);
  const user = useSelector((state: RootState) => state.getUserInfo);

  const { width, height } = useWindowSize();
  const dispatch = useDispatch();

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TBonus>('sort');
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [edit, setEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<Array<TBonus>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteSomething, setDeleteSomething] = useState<Array<TBonus>>([]);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const [maxHeightState, setMaxHeightState] = useState<number>(0);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [rowNumber, setRowNumber] = useState<number>(0);

  const utilMethods = useCommonFunctions<TBonus>();

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
      if (bonusData.length === 0) {
        setIsLoading(true);
        axios
          .get(getBonus, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            params: {
              userID: user.userID,
            },
          })
          .then((res) => {
            if (res.data) {
              dispatch(setBonusContent(res.data));
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
    if (bonusData.length !== editValue.length) {
      setEditValue(bonusData);
    }
  }, [bonusData]);

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
              case 'payday':
                updateValue.payday = value === '' ? null : (value as Date);
                break;
              case 'bonusAmount':
                updateValue.bonusAmount = value === '' ? null : (value as number);
                break;
              case 'companyNum':
                updateValue.companyNum = value === '' ? null : (value as number);
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
    const postData = editValue.map(({ MCompany, TBonus, ...a }) => ({
      ...a,
      userId: user.userID,
    }));
    const deleteData = deleteSomething.map(({ MCompany, TBonus, ...a }) => ({
      ...a,
      userId: user.userID,
    }));
    await axios
      .post(getBonus, postData, { headers: { Authorization: `Bearer ${jwtToken}` } })
      .then((res) => {
        if (res.data) {
          dispatch(setCreateBonus(res.data));
        }
      })
      .catch((error) => {
        console.error(error);
      });
    if (deleteData.length !== 0) {
      await axios
        .post(postDeleteBonus, deleteData, { headers: { Authorization: `Bearer ${jwtToken}` } })
        .then((res) => {
          if (res.data) {
            dispatch(setCreateBonus(res.data));
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
            dataLength={bonusData.length}
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
              <CommonTDataTableHeader<TBonus>
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={selectAllClick}
                rowCount={bonusData.length}
                setOrder={setOrder}
                setOrderBy={setOrderBy}
                labelList={saLaryHeaderList}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = row.sort !== null ? selectedData(row.sort as number) : undefined;
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.sort} sx={{ cursor: 'pointer' }}>
                      <TableCell padding="checkbox">
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
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={row.companyNum}
                          edit={row.sort === rowNumber ? isEditable : false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'companyNum'}
                          id={Number(row.sort)}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomDate
                          value={dayjs(row.payday)}
                          edit={row.sort === rowNumber ? isEditable : false}
                          onChangeValue={changeValue}
                          paramKey={'payday'}
                          id={Number(row.sort)}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={row.bonusAmount}
                          edit={row.sort === rowNumber ? isEditable : false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'bonusAmount'}
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
          <TablePagination
            rowsPerPageOptions={[20, 50, 100]}
            component="div"
            count={bonusData.length}
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

export default BonusTable;
