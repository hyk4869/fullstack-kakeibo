'use client';

import { Button, Tooltip } from '@mui/material';
import { parse } from 'papaparse';
import React, { SetStateAction, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../_store/store';
import LoadingContent from '../commonLayouts/loading';
import { ItemWithId } from '../commonFunctionTypes';

type ImportCSVProps<T extends ItemWithId> = {
  setMakeNewArray: React.Dispatch<SetStateAction<T[]>>;
  setIncrementArray: React.Dispatch<React.SetStateAction<number[]>>;
  setArrayLastId: React.Dispatch<React.SetStateAction<number>>;
  setIncrement: React.Dispatch<React.SetStateAction<number>>;
  convertTypes: (array: T[]) => T[];
  nullCheck: (array: T[]) => T[];
};

/** ジェネリクスで書いた共通のインポートCSV */
export const ImportCSV = <T extends ItemWithId>(props: ImportCSVProps<T>): React.ReactElement => {
  const { setMakeNewArray, setIncrementArray, setArrayLastId, setIncrement, convertTypes, nullCheck } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);

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
        const parsedResult: T[] = await parseFile(file);
        setMakeNewArray((prevArray) => {
          /**型変換 */
          const findCategoryID = convertTypes(parsedResult);

          /** 重複するIDを持つ要素を更新し、新しい要素を追加する */
          const updatedArray = prevArray.map((a) => {
            const matchingCategory = findCategoryID.find((s) => a.id === s.id);
            return matchingCategory ? matchingCategory : a;
          });

          /** 重複しないIDを持つ新しい要素を追加する */
          const newArray = [...updatedArray, ...findCategoryID.filter((s) => !updatedArray.some((a) => a.id === s.id))];

          /**nullチェック */
          const filteredValue = nullCheck(newArray);

          setIncrementArray((prevValue) => {
            return monthlyData.length === 0
              ? newArray.map((a) => Number(a.id))
              : [...prevValue, ...findCategoryID.map((a) => Number(a.id))];
          });

          const resetID = (): number => {
            if (monthlyData.length === 0) {
              return newArray.reduce((maxId, item) => Math.max(maxId, item.id ?? 0), 1);
            } else {
              return findCategoryID.reduce((maxId, item) => Math.max(maxId, item.id ?? 0), 1);
            }
          };

          setArrayLastId(resetID());
          setIncrement(resetID());

          return filteredValue;
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const parseFile = (file: File): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      parse(file, {
        complete: (result) => {
          if (result && result.data) {
            resolve(result.data as T[]);
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
          <Button variant="outlined" color="primary" onClick={handleFileUpload} sx={{ width: '100%' }}>
            CSVのインポート
          </Button>
        </label>
      </Tooltip>
      <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
    </>
  );
};
