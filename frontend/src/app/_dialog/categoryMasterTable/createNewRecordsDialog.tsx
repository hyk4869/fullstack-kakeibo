import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useSelector } from 'react-redux';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import CustomTextfield from '../../_customComponents/customTextfield';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import { RootState } from '../../_store/store';
import { useEffect, useState, useCallback, useMemo } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { grey, red } from '@mui/material/colors';
import NextActionDialog from './nextActionDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExportCSV } from '../../_util/exportCSV';
import TablePagination from '@mui/material/TablePagination';
import { visuallyHidden } from '@mui/utils';
import { categoryHeaders } from '../../_util/exportCSVTitleName';
import { Order, getComparator, incrementFromArray, stableSort } from '@/app/_util/utilFunctions';
import useWindowSize from '@/app/_util/useWindowSize';
import { categoryHeaderList } from '@/app/_util/headerList';
import { MCategory } from '@/app/_store/interfacesInfo';

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
  const [makeNewArray, setMakeNewArray] = useState<Array<MCategory>>([]);
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof MCategory>('categoryId');
  const [windowSize, setWindowSize] = useState<boolean>(false);

  const categoryData = useSelector((state: RootState) => state.getCategoryContent);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (categoryData && categoryData.length >= 0) {
      const ID: number =
        categoryData.length !== 0 || categoryData !== undefined
          ? categoryData.reduce((maxId, item) => Math.max(maxId, item.categoryId ?? 0), 1)
          : 1;
      setArrayLastId(ID);
      setIncrement(ID);
    }
  }, [categoryData]);

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
    const incrementIdFromArray = incrementFromArray(makeNewArray, categoryData, incrementArray);

    const lastId = makeNewArray.slice(-1)[0]?.categoryId;
    if (lastId && incrementIdFromArray === lastId) return;
    const newCategory = {
      categoryId: incrementIdFromArray,
      categoryName: '',
      userId: null,
    };

    setIncrement(incrementIdFromArray);
    setMakeNewArray((prevArray) => [...prevArray, newCategory]);
  }, [increment, makeNewArray, incrementArray]);

  /** 削除機能 */
  const deleteValue = useCallback(
    (id: number | null) => {
      if (id === arrayLastId) return;
      const deletedArray = makeNewArray.filter((a) => a.categoryId !== id);
      setMakeNewArray(deletedArray);

      if (id !== null) {
        const sortedValue = incrementArray.filter((s) => s !== id).map((a) => (a > id ? a - 1 : a));
        setIncrementArray(sortedValue);
        setMakeNewArray((prevId) =>
          prevId.map((a) => {
            return {
              ...a,
              categoryId: a.categoryId && a.categoryId > id ? a.categoryId - 1 : a.categoryId,
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
          if (row.categoryId === id) {
            const updatedRow = { ...row };
            switch (paramKey) {
              case 'categoryId':
                updatedRow.categoryId = value === '' ? null : (value as number);
                break;
              case 'categoryName':
                updatedRow.categoryName = value === '' ? null : (value as string);
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
            {categoryData.length > 0 ? <Box>レコードの最終ID：{arrayLastId}</Box> : <></>}
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
                  {categoryHeaderList.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={'center'}
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
                      key={Number(row?.categoryId)}
                      sx={{
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell component="th" id={String(row?.categoryId)} scope="row?">
                        <CustomNumberFormat
                          value={row?.categoryId}
                          edit={false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'categoryId'}
                          id={Number(row?.categoryId)}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <CustomTextfield
                          value={row?.categoryName}
                          onChangeValue={changeValue}
                          paramKey={'categoryName'}
                          id={Number(row?.categoryId)}
                          edit={edit}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <IconButton onClick={() => deleteValue(row.categoryId)} disabled={!edit}>
                          <DeleteIcon sx={{ cursor: 'pointer', opacity: '0.4', '&:hover': { opacity: '1' } }} />
                        </IconButton>
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
              disabled={makeNewArray.length <= 0}
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
          <ExportCSV headerOption={categoryHeaders} />
          {/* <ImportCSV
              setMakeNewArray={setMakeNewArray}
              setIncrementArray={setIncrementArray}
              setArrayLastId={setArrayLastId}
              setIncrement={setIncrement}
            /> */}
        </Box>

        <NextActionDialog
          isShow={isShowDialog}
          onCloseConfirmDialog={() => setIsShowDialog(false)}
          contentNum={makeNewArray.length}
          content={makeNewArray}
          onCloseMonthlyDialog={onCloseAddRecords}
          setMakeNewArray={setMakeNewArray}
        />
      </Dialog>
    </Box>
  );
};

export default React.memo(CreateNewRecordsDialog);
