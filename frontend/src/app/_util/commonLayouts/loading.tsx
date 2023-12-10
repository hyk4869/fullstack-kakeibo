import { CircularProgress, Dialog } from '@mui/material';
import { blue } from '@mui/material/colors';
import React from 'react';

type LoadingContentProps = {
  isLoading: boolean;
  closeLoading: () => void;
};

const LoadingContent: React.FC<LoadingContentProps> = (props) => {
  const { isLoading, closeLoading } = props;
  return (
    <>
      <Dialog
        open={isLoading ?? false}
        onClose={closeLoading}
        maxWidth="sm"
        PaperProps={{ style: { backgroundColor: blue[50], minWidth: '15rem', minHeight: '3rem' } }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <h3>Loading...</h3>
          <CircularProgress size={20} sx={{ marginLeft: '1rem' }} />
        </div>
      </Dialog>
    </>
  );
};

export default React.memo(LoadingContent);
