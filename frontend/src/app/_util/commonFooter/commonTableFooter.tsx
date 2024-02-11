import { Box, Button, TablePagination } from '@mui/material';
import React from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

type CommonFooterProps = {
  createCSVFile: () => void;
  arrayLength: number;
  rowsPerPage?: number;
  page?: number;
  changePage?: (event: unknown, newPage: number) => void;
  changeRowsPerPage?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const CommonTableFooter: React.FC<CommonFooterProps> = (props) => {
  const { createCSVFile, arrayLength, rowsPerPage, page, changePage, changeRowsPerPage } = props;

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: rowsPerPage !== undefined ? '0 1rem' : '0.75rem 1rem',
        }}
      >
        <Button variant="outlined" onClick={() => createCSVFile()} disabled={arrayLength === 0} size="small">
          CSVダウンロード
        </Button>

        {rowsPerPage !== undefined && page !== undefined && changePage && changeRowsPerPage ? (
          <TablePagination
            rowsPerPageOptions={[20, 50, 100]}
            component="div"
            count={arrayLength}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={changePage}
            onRowsPerPageChange={changeRowsPerPage}
          />
        ) : (
          <></>
        )}
      </Box>
    </>
  );
};

export default React.memo(CommonTableFooter);
