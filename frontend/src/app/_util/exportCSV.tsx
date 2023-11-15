'use client';
import { Tooltip, Button } from '@mui/material';
import { CSVDownload, CSVLink } from 'react-csv';

type ExportCSVProps = {
  //
};

export const ExportCSV: React.FC<ExportCSVProps> = () => {
  const headers = [
    { label: 'id', key: 'id' },
    { label: 'paymentDay', key: 'paymentDay' },
    { label: 'store', key: 'store' },
    { label: 'categoryId', key: 'categoryId' },
    { label: 'usageFee', key: 'usageFee' },
  ];
  const data: string[][] = [];
  const filename = 'example.csv';

  return (
    <>
      <Tooltip title={'CSVをインポートするためのテンプレートをダウンロードします。'} arrow>
        <Button variant="outlined" color="primary" sx={{ margin: '0.75rem 0.75rem' }}>
          <CSVLink data={data} headers={headers} filename={filename} style={{ textDecoration: 'none' }}>
            CSVテンプレート
          </CSVLink>
        </Button>
      </Tooltip>
    </>
  );
};
