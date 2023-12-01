'use client';
import CustomRadioButton, { valueObjType } from '@/app/_customComponents/customRadioButton';
import CustomSwitch from '@/app/_customComponents/customSwitch';
import { Box } from '@mui/material';
import React, { useCallback, useState } from 'react';

type OtherUtilProps = {
  //
};

const list: valueObjType[] = [
  {
    value: 'value1',
    label: 'ラジオボタン値1',
  },
  {
    value: 'value2',
    label: 'ラジオボタン値2',
  },
  {
    value: 'value3',
    label: 'ラジオボタン値3',
  },
];

const OtherUtil: React.FC<OtherUtilProps> = () => {
  const [edit, setEdit] = useState<boolean>(true);
  const [radioContent, setRadioContent] = useState<string>('');
  const [switchValue, setSwitchValue] = useState<boolean>(false);

  const onChangeValue = useCallback(
    (id: number, paramKey: string, value: unknown) => {
      switch (paramKey) {
        case 'radioContent':
          break;
      }
    },
    [edit, radioContent],
  );

  return (
    <Box>
      <Box>
        <CustomRadioButton edit={edit} valueObj={list} value={radioContent} row={true} />
        <CustomSwitch edit={edit} falseText={'falseの時'} trueText={'trueの時'} value={switchValue} />
      </Box>
    </Box>
  );
};

export default React.memo(OtherUtil);
