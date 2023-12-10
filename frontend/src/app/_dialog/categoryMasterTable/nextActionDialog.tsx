import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import React, { useState } from 'react';
import { setCreateCategoryContent } from '../../_store/slice';
import { useDispatch } from 'react-redux';
import LoadingContent from '../../_util/commonLayouts/loading';
import { MCategory } from '@/app/_store/interfacesInfo';

type NextActionDialogProps = {
  isShow: boolean;
  onCloseConfirmDialog: () => void;
  contentNum: number;
  content: MCategory[];
  onCloseMonthlyDialog: () => void;
  setMakeNewArray: React.Dispatch<React.SetStateAction<MCategory[]>>;
};

const NextActionDialog: React.FC<NextActionDialogProps> = (props) => {
  const { isShow, onCloseConfirmDialog, contentNum, content, onCloseMonthlyDialog, setMakeNewArray } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const saveValue = async (): Promise<void> => {
    setIsLoading(true);
    if (content.every((d) => d.categoryId !== null && d.categoryName !== null)) {
      try {
        const idSet = new Set<number | null>();
        const hasDuplicate = content.some((d) => {
          if (idSet.has(d.categoryId)) {
            return true;
          } else {
            idSet.add(d.categoryId);
            return false;
          }
        });
        if (!hasDuplicate) {
          dispatch(setCreateCategoryContent(content));
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
            {`レコードid ${content.map((a) => a.categoryId).join(' , ')} が追加の対象となります。`}
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

export default React.memo(NextActionDialog);
