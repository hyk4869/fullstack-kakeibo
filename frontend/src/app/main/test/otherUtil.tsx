'use client';
import CustomRadioButton, { ValueObjType } from '@/app/_customComponents/customRadioButton';
import CustomSwitch from '@/app/_customComponents/customSwitch';
import CustomToggleButton from '@/app/_customComponents/customToggleButton';
import { Box } from '@mui/material';
import React, { useCallback, useState } from 'react';

type OtherUtilProps = {
  //
};

const list: ValueObjType[] = [
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

const toggleList: ValueObjType[] = [
  {
    value: 'value1',
    label: 'android',
  },
  {
    value: 'value2',
    label: 'iOS',
  },
  {
    value: 'value3',
    label: 'Windows',
  },
];

const OtherUtil: React.FC<OtherUtilProps> = () => {
  const [edit, setEdit] = useState<boolean>(true);
  const [radioContent, setRadioContent] = useState<string>('');
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  const [toggleContent, setToggleContent] = useState<string>('');

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
        <CustomToggleButton
          edit={edit}
          valueObj={toggleList}
          value={toggleContent}
          paramkey={'toggle'}
          onChangeValue={onChangeValue}
        />
      </Box>
    </Box>
  );
};

export default React.memo(OtherUtil);
