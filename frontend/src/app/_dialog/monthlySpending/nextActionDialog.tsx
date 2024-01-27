import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import React, { useState } from 'react';
import { setCreateMonthlySpending } from '../../_store/slice';
import { useDispatch } from 'react-redux';
import LoadingContent from '../../_util/commonLayouts/loading';
import { TMonthlySpending } from '@/app/_store/interfacesInfo';

type MonthlyNextActionDialogProps = {
  isShow: boolean;
  onCloseConfirmDialog: () => void;
  contentNum: number;
  content: TMonthlySpending[];
  onCloseMonthlyDialog: () => void;
  setMakeNewArray: React.Dispatch<React.SetStateAction<TMonthlySpending[]>>;
  setEditLogValue: React.Dispatch<React.SetStateAction<TMonthlySpending[]>>;
};

const MonthlyNextActionDialog: React.FC<MonthlyNextActionDialogProps> = (props) => {
  const { isShow, onCloseConfirmDialog, contentNum, content, onCloseMonthlyDialog, setMakeNewArray, setEditLogValue } =
    props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const saveValue = async (): Promise<void> => {
    setIsLoading(true);
    if (
      content.every(
        (d) =>
          d.sort !== null &&
          d.paymentDay !== null &&
          !isNaN(d.paymentDay.getTime()) &&
          d.store !== null &&
          d.usageFee !== null,
      )
    ) {
      try {
        const idSet = new Set<number | null>();
        const hasDuplicate = content.some((d) => {
          if (idSet.has(d.sort)) {
            return true;
          } else {
            idSet.add(d.sort);
            return false;
          }
        });
        if (!hasDuplicate) {
          setEditLogValue((prev) => [...prev, ...content]);
          dispatch(setCreateMonthlySpending(content));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        onCloseConfirmDialog();
        onCloseMonthlyDialog();
        setMakeNewArray([]);
      }
    } else {
      window.alert('いずれかの項目が空です。');
      setIsLoading(false);
      onCloseConfirmDialog();
    }
  };

  return (
    <>
      <Dialog
        open={isShow ?? false}
        onClose={onCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'レコードを追加しますか？'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`追加されるレコード数は ${contentNum} 件です。`}
          </DialogContentText>
          <br />
          <DialogContentText id="alert-dialog-description">
            {`レコードid ${content.map((a) => a.sort).join(' , ')} が追加の対象となります。`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseConfirmDialog} variant="contained" color="error">
            いいえ
          </Button>
          <Button onClick={saveValue} variant="contained">
            はい
          </Button>
        </DialogActions>
      </Dialog>
      <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
    </>
  );
};

export default React.memo(MonthlyNextActionDialog);
