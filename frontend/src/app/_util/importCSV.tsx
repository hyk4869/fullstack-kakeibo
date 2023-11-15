'use client';

import { Button, Tooltip } from '@mui/material';
import Papa from 'papaparse';
import { TMonthlySpending } from '../_store/slice';
import React, { SetStateAction } from 'react';

type ImportCSVProps = {
  setMakeNewArray: React.Dispatch<SetStateAction<TMonthlySpending[]>>;
};

export const ImportCSV: React.FC<ImportCSVProps> = (props) => {
  const { setMakeNewArray } = props;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const parsedResult = await parseFile(file);
      setMakeNewArray(parsedResult as TMonthlySpending[]);
    }
  };

  const parseFile = (file: File): Promise<TMonthlySpending[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (result) => {
          if (result && result.data) {
            resolve(result.data as TMonthlySpending[]);
          } else {
            reject(new Error('Failed to parse CSV file.'));
          }
        },
        header: true,
      });
    });
  };

  return (
    <>
      <Tooltip title={'CSVをインポートします。'} arrow>
        <label>
          <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
          <Button variant="outlined" color="primary" sx={{ margin: '0.75rem 0.75rem' }}>
            CSVのインポート
          </Button>
        </label>
      </Tooltip>
    </>
  );
};
