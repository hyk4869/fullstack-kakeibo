import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { useSelector } from 'react-redux';
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import { RootState } from '../../_store/store';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { grey } from '@mui/material/colors';
import NextActionDialog from './nextActionDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExportExampleCSV } from '../../_util/CSV/exportExampleCSV';
import TablePagination from '@mui/material/TablePagination';
import { hireDateHeaders } from '../../_util/CSV/exportCSVTitleName';
import {
  Order,
  convertHireDateTypes,
  getComparator,
  hireDateNullCheck,
  incrementFromArray,
  stableSort,
} from '@/app/_util/utilFunctions';
import useWindowSize from '@/app/_util/useWindowSize';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import CustomDate from '@/app/_customComponents/customDate';
import dayjs from 'dayjs';
import { hireDateHeaderList } from '@/app/_util/commonLayouts/headerList';
import { MHireDate } from '@/app/_store/interfacesInfo';
import { CommonEditButton } from '../commonContent/commonEditButton';
import CommonTableHeader from '@/app/_util/commonLayouts/commonTableHeader';
import { ImportCSV } from '@/app/_util/CSV/importCSV';

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
  const [makeNewArray, setMakeNewArray] = useState<Array<MHireDate>>([]);
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof MHireDate>('id');
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const companyData = useSelector((state: RootState) => state.getCompanyContent);
  const hireDateData = useSelector((state: RootState) => state.getHireDate);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (hireDateData && hireDateData.length >= 0) {
      const ID: number =
        hireDateData.length !== 0 || hireDateData !== undefined
          ? hireDateData.reduce((maxId, item) => Math.max(maxId, item.id ?? 0), 1)
          : 1;
      setArrayLastId(ID);
      setIncrement(ID);
    }
  }, [hireDateData]);

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
    const incrementIdFromArray = incrementFromArray(makeNewArray, hireDateData, incrementArray);

    const lastId = makeNewArray.slice(-1)[0]?.id;
    if (lastId && incrementIdFromArray === lastId) return;
    const newCategory = {
      id: incrementIdFromArray,
      hireDate: null,
      retirementDate: null,
      companyId: null,
      userId: null,
    };

    setIncrement(incrementIdFromArray);
    setMakeNewArray((prevArray) => [...prevArray, newCategory]);
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
              case 'hireDate':
                updatedRow.hireDate = value === '' ? null : (value as Date);
                break;
              case 'retirementDate':
                updatedRow.retirementDate = value === '' ? null : (value as Date);
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
          <CommonEditButton
            reduxArray={hireDateData}
            arrayLastId={arrayLastId}
            makeNewArray={makeNewArray}
            addNewArray={addNewArray}
            showDialog={showDialog}
            onCloseAddRecords={onCloseAddRecords}
          />

          <TableContainer sx={{ display: 'flex', justifyContent: 'center', width: '100%', maxHeight: '550px' }}>
            <Table>
              <CommonTableHeader categoryHeaderList={hireDateHeaderList} />

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

                      <Tooltip title={companyData.find((d) => d.id === row.companyId)?.name} arrow>
                        <TableCell align="center" sx={{ padding: commonPadding5 }}>
                          <CustomNumberFormat
                            value={row.companyId}
                            edit={edit}
                            align="center"
                            onChangeValue={changeValue}
                            paramKey={'companyId'}
                            id={Number(row.id)}
                          />
                        </TableCell>
                      </Tooltip>

                      <TableCell align="center">
                        <CustomDate
                          value={dayjs(row?.hireDate)}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'hireDate'}
                          id={Number(row?.id)}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <CustomDate
                          value={dayjs(row?.retirementDate)}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'retirementDate'}
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
          <ExportExampleCSV headerOption={hireDateHeaders} />
          <ImportCSV<MHireDate>
            setMakeNewArray={setMakeNewArray}
            setIncrementArray={setIncrementArray}
            setArrayLastId={setArrayLastId}
            setIncrement={setIncrement}
            convertTypes={convertHireDateTypes}
            nullCheck={hireDateNullCheck}
          />
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
