'use client';

import { Button, Tooltip } from '@mui/material';
import { parse } from 'papaparse';
import { TMonthlySpending } from '../_store/slice';
import React, { SetStateAction, useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

type ImportCSVProps = {
  setMakeNewArray: React.Dispatch<SetStateAction<TMonthlySpending[]>>;
};

export const ImportCSV: React.FC<ImportCSVProps> = (props) => {
  const { setMakeNewArray } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      try {
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
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const parseFile = (file: File): Promise<TMonthlySpending[]> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      parse(file, {
        complete: (result) => {
          if (result && result.data) {
            resolve(result.data as TMonthlySpending[]);
          } else {
            reject(new Error('Failed to parse CSV file.'));
          }
          setIsLoading(false);
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
      {isLoading === false ? (
        <></>
      ) : (
        <div
          style={{
            display: 'flex',
            margin: '0 2rem',
            alignItems: 'center',
            maxHeight: '1px',
            transform: 'translateX(50px)',
          }}
        >
          <h5>Loading...</h5>
          <CircularProgress size={20} sx={{ marginLeft: '1rem' }} />
        </div>
      )}
    </>
  );
};
