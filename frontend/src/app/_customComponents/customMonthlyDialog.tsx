import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { MCategory, TMonthlySpending, setCreateMonthlySpending } from '../_store/slice';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { CustomDate } from './customDate';
import { CustomSelectTab } from './customSelectTab';
import { CustomTextfield } from './customTextfield';
import { CustomNumberFormat } from './customNumeric';
import { RootState } from '../_store/store';
import dayjs from 'dayjs';
import { useEffect, useState, useCallback } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { grey, red } from '@mui/material/colors';

type CustomMonthlyDialogProps = {
  openDialog: boolean;
  onClose: () => void;
  edit?: boolean;
};
const CustomMonthlyDialog: React.FC<CustomMonthlyDialogProps> = (props) => {
  const { openDialog, onClose, edit } = props;
  const [arrayLastId, setArrayLastId] = useState<number>(0);
  const [increment, setIncrement] = useState<number>(arrayLastId);
  const [makeNewArray, setMakeNewArray] = useState<Array<TMonthlySpending>>([]);

  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);

  useEffect(() => {
    const ID: number = monthlyData.map((a) => (a.id ?? 0) as number).slice(-1)[0];
    setArrayLastId(ID);
    setIncrement(ID);

    const pickLastContent: TMonthlySpending = monthlyData.map((a) => a).slice(-1)[0];
    setMakeNewArray([pickLastContent]);
  }, [monthlyData, categoryData]);

  /**値の更新関数 */
  const changeValue = useCallback(
    (paramKey: string, value: unknown) => {
      setMakeNewArray((prevArray) => {
        return prevArray.map((row) => {
          if (row.id === Number(paramKey)) {
            return {
              ...row,
              [paramKey]: value === '' ? null : value,
            };
          } else {
            return row;
          }
        });
      });
    },
    [makeNewArray],
  );

  console.log(makeNewArray);

  /**新しいレコードの追加 */
  const addNewArray = useCallback(() => {
    const newMonthlySpending = {
      id: increment + 1,
      userId: null,
      paymentDay: null,
      store: '',
      usageFee: 0,
      categoryId: null,
    };
    setIncrement((prevValue) => prevValue + 1);
    setMakeNewArray((prevArray) => [...prevArray, newMonthlySpending]);
  }, [increment, makeNewArray]);

  const dispatch = useDispatch();

  return (
    <Box sx={{ width: '100%' }}>
      <Dialog
        open={openDialog ?? false}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen={true}
      >
        <Paper sx={{ width: '95%', margin: '1rem auto', background: grey[100] }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', padding: '1rem', justifyContent: 'center' }}>
            <Box>レコードの最終ID：{arrayLastId}</Box>
            <Box sx={{ margin: '0 2rem' }}>{makeNewArray.length - 1} 個のレコードを追加</Box>
            <AddCircleOutlineIcon
              onClick={() => addNewArray()}
              sx={{ cursor: 'pointer', opacity: '0.5', '&:hover': { opacity: '1' } }}
            />
          </Box>

          <TableContainer sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <TableBody sx={{ maxHeight: '450px' }}>
              {makeNewArray?.map((row) => {
                return (
                  <TableRow
                    role="checkbox"
                    tabIndex={-1}
                    key={row?.id}
                    sx={{
                      cursor: 'pointer',
                      background: row?.id === arrayLastId ? grey[400] : undefined,
                    }}
                  >
                    <TableCell component="th" id={String(row?.id)} scope="row?">
                      {row?.id}
                    </TableCell>
                    <TableCell align="center">
                      <CustomDate
                        date={dayjs(row?.paymentDay)}
                        edit={row?.id === arrayLastId ? false : edit}
                        onChangeValue={changeValue}
                        paramKey={String(row?.id)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomTextfield value={row?.store} edit={row?.id === arrayLastId ? false : edit} />
                    </TableCell>
                    <TableCell align="center">
                      <CustomSelectTab
                        list={categoryData.map((a: MCategory) => {
                          return { value: String(a.categoryId), label: String(a.categoryName) };
                        })}
                        value={categoryData.find((a) => a.categoryId === row?.categoryId)?.categoryName}
                        edit={row?.id === arrayLastId ? false : edit}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <CustomNumberFormat
                        value={row?.usageFee}
                        suffix=" 円"
                        edit={row?.id === arrayLastId ? false : edit}
                        align="center"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="error"
              sx={{
                margin: '0.75rem 1.5rem',
                color: red[500],
                borderColor: red[500],
              }}
              onClick={onClose}
            >
              キャンセル
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ margin: '0.75rem 1.5rem' }}
              onClick={() => addNewArray()}
            >
              レコード追加
            </Button>
            <Button variant="contained" sx={{ margin: '0.75rem 1.5rem' }} disabled={makeNewArray.length - 1 === 0}>
              確定
            </Button>
          </Box>
        </Paper>
      </Dialog>
    </Box>
  );
};

export default React.memo(CustomMonthlyDialog);
