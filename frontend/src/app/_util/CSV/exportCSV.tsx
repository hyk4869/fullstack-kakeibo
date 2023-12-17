'use client';
import { Tooltip, Button } from '@mui/material';
import { CSVLink } from 'react-csv';
import React from 'react';

type HeaderOption = {
  label: string;
  key: string;
};

type ExportCSVProps = {
  headerOption: HeaderOption[];
};

export const ExportCSV: React.FC<ExportCSVProps> = (props) => {
  const { headerOption } = props;

  const data: string[][] = [];
  const filename = 'example.csv';

  return (
    <>
      <Tooltip title={'CSVをインポートするためのテンプレートをダウンロードします。'} arrow>
        <Button variant="outlined" color="primary">
          <CSVLink data={data} headers={headerOption} filename={filename} style={{ textDecoration: 'none' }}>
            CSVテンプレート
          </CSVLink>
        </Button>
      </Tooltip>
    </>
  );
};
