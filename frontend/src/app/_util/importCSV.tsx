'use client';

import { Button, Tooltip } from '@mui/material';
import Papa from 'papaparse';
import { TMonthlySpending } from '../_store/slice';
import React, { SetStateAction, useRef } from 'react';

type ImportCSVProps = {
  setMakeNewArray: React.Dispatch<SetStateAction<TMonthlySpending[]>>;
};

export const ImportCSV: React.FC<ImportCSVProps> = (props) => {
  const { setMakeNewArray } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * input要素をクリックする
   */
  const handleFileUpload = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (file) {
      const parsedResult: TMonthlySpending[] = await parseFile(file);
      setMakeNewArray((prevArray) => {
        const findCategoryID = parsedResult.map((s) => {
          return {
            ...s,
            id: s.id !== null ? parseInt(String(s.id)) : null,
            paymentDay: s.paymentDay !== null ? new Date(s.paymentDay) : null,
            categoryId: s.categoryId !== null ? parseInt(String(s.categoryId)) : null,
            usageFee: s.usageFee !== null ? parseInt(String(s.usageFee)) : null,
          };
        });
        const v = findCategoryID.filter((a) => a.id);
        return [...prevArray, ...v];
      });
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
      <Tooltip title={'CSVをインポートします。idが空の場合は追加されません。'} arrow>
        <label>
          <input type="file" style={{ display: 'none' }} onChange={handleFileChange} ref={fileInputRef} />
          <Button variant="outlined" color="primary" sx={{ margin: '0.75rem 0.75rem' }} onClick={handleFileUpload}>
            CSVのインポート
          </Button>
        </label>
      </Tooltip>
    </>
  );
};
