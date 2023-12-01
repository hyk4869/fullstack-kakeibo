'use client';
import CustomDate from '@/app/_customComponents/customDate';
import CustomSelectTab from '@/app/_customComponents/customSelectTab';
import CustomTextfield from '@/app/_customComponents/customTextfield';
import CustomNumberFormat from '@/app/_customComponents/customNumeric';
import { Box } from '@mui/material';
import { Dayjs } from 'dayjs';
import React, { useCallback, useState } from 'react';

type selectTabContent = {
  value: number;
  label: string;
};

type OutlinedContentProps = {
  //
};

const OutlinedContent: React.FC<OutlinedContentProps> = () => {
  const [edit, setEdit] = useState<boolean>(true);
  const [numberValue, setNumberValue] = useState<number | null>(null);
  const [stringValue, setStringValue] = useState<string | null>('');
  const [selectTab, setSelectTab] = useState<number | null>(null);
  const [pickDate, setPickDate] = useState<Date | Dayjs | null>(null);

  const list: selectTabContent[] = [
    {
      value: 1,
      label: 'サンプル1',
    },
    {
      value: 2,
      label: 'サンプル2',
    },
    {
      value: 3,
      label: 'サンプル3',
    },
  ];

  const onChangeValue = useCallback(
    (id: number, paramKey: string, value: unknown) => {
      switch (paramKey) {
        case 'numberValue':
          typeof value === 'number' ? setNumberValue(value) : setNumberValue(Number(value));
          break;
        case 'stringValue':
          typeof value === 'string' ? setStringValue(value) : setStringValue(String(value));
          break;
        case 'selectTab':
          typeof value === 'number' ? setSelectTab(value) : setSelectTab(Number(value));
          break;
        case 'pickDate':
          if (value instanceof Date) {
            setPickDate(value);
          } else {
            console.error(`Invalid type for pickDate: ${typeof value}`);
          }
          break;
      }
    },
    [edit, numberValue, stringValue, selectTab, pickDate],
  );

  return (
    <>
      <Box sx={{ paddingLeft: '1rem' }}>
        <Box>
          <h2 style={{ color: 'red' }}>Outlined</h2>
          <h3>numberの入力例</h3>
          <CustomNumberFormat
            value={numberValue}
            onChangeValue={onChangeValue}
            paramKey={'numberValue'}
            id={0}
            edit={edit}
            maxWidth="13rem"
            width="13rem"
            align="left"
            margin="none"
            variant="outlined"
            suffix="Kg"
          />
        </Box>
        <Box>
          <h3>stringsの入力例</h3>
          <CustomTextfield
            value={stringValue}
            onChangeValue={onChangeValue}
            paramKey={'stringValue'}
            id={1}
            edit={edit}
            align="left"
            variant="outlined"
          />
        </Box>
        <Box>
          <h3>プルダウンの例</h3>
          <CustomSelectTab
            value={selectTab}
            list={list}
            onChangeValue={onChangeValue}
            paramKey={'selectTab'}
            id={2}
            edit={edit}
            align="left"
            width="13rem"
            variant="outlined"
          />
        </Box>
        <Box>
          <h3>日付の例</h3>
          <CustomDate
            value={pickDate}
            onChangeValue={onChangeValue}
            paramKey={'pickDate'}
            id={3}
            edit={edit}
            maxWidth="13rem"
            width="13rem"
            variant="outlined"
          />
        </Box>
      </Box>
    </>
  );
};

export default React.memo(OutlinedContent);
