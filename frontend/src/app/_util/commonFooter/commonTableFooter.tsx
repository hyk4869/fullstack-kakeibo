import { Box, Button, IconButton, TablePagination, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import useWindowSize from '../useWindowSize';

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
  const [changeIconSize, setChangeIconSize] = useState<boolean>(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (width < 650) {
      setChangeIconSize(true);
    } else {
      setChangeIconSize(false);
    }
  }, [width, height]);

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
        {changeIconSize ? (
          <Tooltip title="データをCSVとしてダウンロード" arrow>
            <IconButton
              onClick={() => createCSVFile()}
              disabled={arrayLength === 0}
              size="medium"
              sx={{ padding: '0', margin: '0', ':hover': { color: 'primary.main' } }}
            >
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Button variant="outlined" onClick={() => createCSVFile()} disabled={arrayLength === 0} size="small">
            CSVダウンロード
          </Button>
        )}

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
