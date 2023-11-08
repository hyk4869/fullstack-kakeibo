import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import React from 'react';
import { TMonthlySpending } from '../_store/slice';

type NextActionDialogProps = {
  isShow: boolean;
  onClose: () => void;
  contentNum: number;
  contentID: TMonthlySpending[];
};

const NextActionDialog: React.FC<NextActionDialogProps> = (props) => {
  const { isShow, onClose, contentNum, contentID } = props;

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
            {`追加されるレコード数は ${contentNum} つです。`}
          </DialogContentText>
          <br />
          <DialogContentText id="alert-dialog-description">
            {`レコードid ${contentID.map((a) => a.id).join(' , ')} が追加の対象となります。`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="error">
            いいえ
          </Button>
          <Button onClick={onClose} variant="contained">
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(NextActionDialog);
