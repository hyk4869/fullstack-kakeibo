import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import React, { useState } from 'react';
import { TMonthlySpending, setCreateMonthlySpending } from '../_store/slice';
import { useDispatch } from 'react-redux';

type MonthlyNextActionDialogProps = {
  isShow: boolean;
  onClose: () => void;
  contentNum: number;
  content: TMonthlySpending[];
  onCloseMonthlyDialog: () => void;
};

const MonthlyNextActionDialog: React.FC<MonthlyNextActionDialogProps> = (props) => {
  const { isShow, onClose, contentNum, content, onCloseMonthlyDialog } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const dispatch = useDispatch();

  const saveValue = async (): Promise<void> => {
    setIsLoading(true);
    if (
      content.every(
        (d) =>
          d.id !== null &&
          d.paymentDay !== null &&
          !isNaN(d.paymentDay.getTime()) &&
          d.store !== null &&
          d.usageFee !== null,
      )
    ) {
      try {
        dispatch(setCreateMonthlySpending(content));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        onClose();
        onCloseMonthlyDialog();
      }
    } else {
      window.alert('レコードのいずれかの項目が空です。');
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={isShow ?? false}
        onClose={onClose}
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
            {`レコードid ${content.map((a) => a.id).join(' , ')} が追加の対象となります。`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="error">
            いいえ
          </Button>
          <Button onClick={saveValue} variant="contained">
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(MonthlyNextActionDialog);
