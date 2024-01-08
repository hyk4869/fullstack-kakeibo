import { Box, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/navigation';

type MessageDialogProps = {
  message: string;
  messageDialog: boolean;
  closeDialog: () => void;
  changePage: boolean;
};

const MessageDialog: React.FC<MessageDialogProps> = (props) => {
  const { message, messageDialog, closeDialog, changePage } = props;
  const router = useRouter();

  const changePageToLogin = () => {
    router.push('/login');
  };

  return (
    <Box>
      <Dialog open={messageDialog ?? false} maxWidth="sm">
        <DialogContent>{message}</DialogContent>
        <DialogActions sx={{ display: 'flex', gap: '1rem' }}>
          {changePage ? (
            <Button onClick={changePageToLogin} variant="outlined">
              go sign in page
            </Button>
          ) : (
            <></>
          )}
          <Button onClick={closeDialog} variant="outlined">
            close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessageDialog;
