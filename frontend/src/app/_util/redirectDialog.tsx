import { Box, Button, Dialog } from '@mui/material';
import { blue } from '@mui/material/colors';
import React from 'react';
import Link from 'next/link';

type RedirectDialogProps = {
  openRedirect: boolean;
  closeRedirect: () => void;
  url: string;
  message: string;
};

const RedirectDialog: React.FC<RedirectDialogProps> = (props) => {
  const { openRedirect, closeRedirect, message, url } = props;

  return (
    <>
      <Dialog
        open={openRedirect ?? false}
        onClose={closeRedirect}
        maxWidth="md"
        PaperProps={{ style: { backgroundColor: blue[50], minWidth: '15rem', minHeight: '10rem' } }}
      >
        <Box sx={{ padding: '2rem', whiteSpace: 'pre-line' }}>{message}</Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Link href={url}>
            <Button color="primary" variant="contained">
              遷移先
            </Button>
          </Link>
          <Link href={'/'}>
            <Button color="error" variant="contained">
              TOPへ戻る
            </Button>
          </Link>
          <Button color="error" variant="outlined" onClick={closeRedirect}>
            閉じる
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default React.memo(RedirectDialog);
