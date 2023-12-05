'use client';
import CustomDate from '@/app/_customComponents/customDate';
import { commonFontSize } from '@/app/_customComponents/customProperties';
import { Box } from '@mui/material';
import React from 'react';
import { SortedDateType } from './aggregationByCategory';

type CommonFooterAggregationProps = {
  sortedDate: SortedDateType | undefined;
};

const changeValue = () => {
  //
};

const CommonFooterAggregation: React.FC<CommonFooterAggregationProps> = (props) => {
  const { sortedDate } = props;
  return (
    <>
      <Box
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', padding: '10px', alignItems: 'end' }}
      >
        <Box sx={{ fontSize: commonFontSize, marginRight: '1rem' }}>データの抽出期間</Box>
        <Box sx={{ marginRight: '0.5rem' }}>
          <CustomDate
            value={sortedDate?.startDate !== undefined ? sortedDate?.startDate : null}
            paramKey="startDate"
            id={Number(1)}
            onChangeValue={changeValue}
            format="YYYY年MM月"
          />
        </Box>
        <Box>-</Box>
        <Box sx={{ marginLeft: '0.5rem' }}>
          <CustomDate
            value={sortedDate?.endDate !== undefined ? sortedDate?.endDate : null}
            paramKey="endDate"
            id={Number(2)}
            onChangeValue={changeValue}
            format="YYYY年MM月"
          />
        </Box>
      </Box>
    </>
  );
};

export default React.memo(CommonFooterAggregation);
