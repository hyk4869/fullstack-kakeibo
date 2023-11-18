import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { MCategory, TMonthlySpending } from '../_store/slice';
import { useSelector } from 'react-redux';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import CustomDate from '../_customComponents/customDate';
import CustomSelectTab from '../_customComponents/customSelectTab';
import CustomTextfield from '../_customComponents/customTextfield';
import CustomNumberFormat from '../_customComponents/customNumeric';
import { RootState } from '../_store/store';
import dayjs from 'dayjs';
import { useEffect, useState, useCallback } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { grey, red } from '@mui/material/colors';
import MonthlyNextActionDialog from './monthlyNextActionDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExportCSV } from '../_util/exportCSV';
import { ImportCSV } from '../_util/importCSV';
import { ShowCategoryMaster } from './showCategory';

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
  const [makeNewArray, setMakeNewArray] = useState<Array<TMonthlySpending>>([]);
  const [isShowDialog, setIsShowDialog] = useState<boolean>(false);
  const [isShowCategoryMaster, setIsShowCategoryMaster] = useState<boolean>(false);

  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);

  useEffect(() => {
    if (monthlyData && monthlyData.length >= 0) {
      const ID: number =
        monthlyData.length !== 0 || monthlyData !== undefined
          ? monthlyData.reduce((maxId, item) => Math.max(maxId, item.id ?? 0), 1)
          : 1;
      console.log(ID);
      setArrayLastId(ID);
      setIncrement(ID);

      const newMonthlySpending = {
        id: 1,
        userId: null,
        paymentDay: null,
        store: '',
        usageFee: null,
        categoryId: null,
      };

      const pickLastContent: TMonthlySpending | undefined =
        increment !== 1 ? monthlyData.find((item) => item.id === ID) : newMonthlySpending;
      if (pickLastContent) {
        setMakeNewArray([pickLastContent]);
      }
    }
  }, [monthlyData]);

  useEffect(() => {
    if (increment !== null && increment !== undefined && increment > 0 && incrementArray.slice(-1)[0] !== increment) {
      setIncrementArray((prevValue) => [...prevValue, increment]);
    }
  }, [increment]);

  /** 新しいレコードの追加 */
  const addNewArray = useCallback(() => {
    const incrementFromArray = incrementArray.slice(-1)[0] + 1;
    const lastId = makeNewArray.slice(-1)[0]?.id;
    if (lastId && incrementFromArray === lastId) return;
    const newMonthlySpending = {
      id: incrementFromArray,
      userId: null,
      paymentDay: null,
      store: '',
      usageFee: null,
      categoryId: null,
    };
    setIncrement(incrementFromArray);
    setMakeNewArray((prevArray) => [...prevArray, newMonthlySpending]);
    console.log({ makeNewArray, increment, incrementArray });
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
    [makeNewArray],
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
        <Paper sx={{ width: '95%', margin: '1rem auto', background: grey[100] }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', padding: '1rem', justifyContent: 'center' }}>
            {monthlyData.length > 0 ? <Box>レコードの最終ID：{arrayLastId}</Box> : <></>}
            <Box sx={{ margin: '0 2rem' }}>
              {makeNewArray.length > 0 ? makeNewArray.length - 1 : 0} 件のレコードを追加
            </Box>
            <AddCircleOutlineIcon
              onClick={() => addNewArray()}
              sx={{ cursor: 'pointer', opacity: '0.5', '&:hover': { opacity: '1' } }}
            />
          </Box>

          <TableContainer sx={{ display: 'flex', justifyContent: 'center', width: '100%', maxHeight: '550px' }}>
            <Table>
              <TableBody>
                {makeNewArray?.map((row) => {
                  return (
                    <TableRow
                      tabIndex={-1}
                      key={Number(row?.id)}
                      sx={{
                        cursor: 'pointer',
                        background: row?.id === arrayLastId && arrayLastId !== 1 ? grey[400] : undefined,
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

                      <TableCell align="center">
                        <CustomDate
                          value={dayjs(row?.paymentDay)}
                          edit={row?.id === arrayLastId && arrayLastId !== 1 ? false : edit}
                          onChangeValue={changeValue}
                          paramKey={'paymentDay'}
                          id={Number(row?.id)}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <CustomTextfield
                          value={row?.store}
                          onChangeValue={changeValue}
                          paramKey={'store'}
                          id={Number(row?.id)}
                          edit={row?.id === arrayLastId && arrayLastId !== 1 ? false : edit}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <CustomSelectTab
                          list={categoryData.map((a: MCategory) => {
                            return { value: Number(a.categoryId), label: String(a.categoryName) };
                          })}
                          value={categoryData.find((a) => a.categoryId === row?.categoryId)?.categoryId ?? null}
                          edit={row?.id === arrayLastId && arrayLastId !== 1 ? false : edit}
                          paramKey={'categoryId'}
                          id={Number(row?.id)}
                          onChangeValue={changeValue}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <CustomNumberFormat
                          value={row?.usageFee}
                          suffix=" 円"
                          edit={row?.id === arrayLastId && arrayLastId !== 1 ? false : edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'usageFee'}
                          id={Number(row?.id)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <DeleteIcon
                          onClick={() => deleteValue(row.id)}
                          sx={{ cursor: 'pointer', opacity: '0.5', '&:hover': { opacity: '1' } }}
                        />
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
              color="secondary"
              sx={{ margin: '0.75rem 0.75rem' }}
              onClick={() => addNewArray()}
            >
              レコード追加
            </Button>
            <Button
              variant="contained"
              sx={{ margin: '0.75rem 0.75rem' }}
              disabled={makeNewArray.length - 1 === 0}
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
        </Paper>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ position: 'absolute', bottom: '0' }}>
            <ExportCSV />
            <ImportCSV setMakeNewArray={setMakeNewArray} />
            <Button onClick={() => setIsShowCategoryMaster(true)} variant="outlined" sx={{ margin: '0.75rem 0.75rem' }}>
              カテゴリーIDを参照する
            </Button>
          </Box>
        </Box>

        <MonthlyNextActionDialog
          isShow={isShowDialog}
          onCloseConfirmDialog={() => setIsShowDialog(false)}
          contentNum={makeNewArray.length - 1}
          content={makeNewArray.filter((a) => a?.id !== arrayLastId)}
          onCloseMonthlyDialog={onCloseAddRecords}
        />
        <ShowCategoryMaster
          isShowCategoryMaster={isShowCategoryMaster}
          onCloseCategoryMaster={() => setIsShowCategoryMaster(false)}
        />
      </Dialog>
    </Box>
  );
};

export default React.memo(CreateNewRecordsDialog);
