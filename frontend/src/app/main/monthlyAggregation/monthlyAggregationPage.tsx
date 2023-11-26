'use client';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Paper, Tab } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useState } from 'react';
import AggregationByCategory from './aggregationByCategory';

type MonthlyAggregationProps = {
  //
};
const MonthlyAggregation: React.FC<MonthlyAggregationProps> = () => {
  const [changePage, setChangePage] = useState<string>('1');

  const hamdleChangePage = (e: React.SyntheticEvent, newValue: string) => {
    setChangePage(newValue);
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '95%', margin: '1rem auto', background: grey[50] }}>
          <TabContext value={changePage}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={hamdleChangePage}>
                <Tab label="カテゴリーごとの集計" value="1" />
                <Tab label="全期間の合計" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <AggregationByCategory />
            </TabPanel>
            <TabPanel value="2">item two</TabPanel>
          </TabContext>
        </Paper>
      </Box>
    </>
  );
};

export default React.memo(MonthlyAggregation);
