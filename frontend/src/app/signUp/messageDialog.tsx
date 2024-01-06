import { Box, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import React from 'react';

type MessageDialogProps = {
  message: string;
  messageDialog: boolean;
  closeDialog: () => void;
};

const MessageDialog: React.FC<MessageDialogProps> = (props) => {
  const { message, messageDialog, closeDialog } = props;
  return (
    <Box>
      <Dialog open={messageDialog ?? false} maxWidth="sm">
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessageDialog;
