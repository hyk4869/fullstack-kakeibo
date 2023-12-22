'use client';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Paper, Tab } from '@mui/material';
import { grey, yellow } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import AggregationByCategory from './aggregationByCategory';
import useWindowSize from '@/app/_util/useWindowSize';
import AggregationByMonth from './aggregationByMonth';
import AggregationByDetailMonth from './aggregationByDetailMonth';

type MonthlyAggregationProps = {
  //
};
const MonthlyAggregation: React.FC<MonthlyAggregationProps> = () => {
  const [changePage, setChangePage] = useState<string>('1');
  const [windowSize, setWindowSize] = useState<boolean>(false);

  const { width, height } = useWindowSize();

  const hamdleChangePage = (e: React.SyntheticEvent, newValue: string) => {
    setChangePage(newValue);
  };

  useEffect(() => {
    if (width < 500) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width]);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '95%', margin: '0.5rem auto', background: grey[50] }}>
          <TabContext value={changePage}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={hamdleChangePage}>
                <Tab label="カテゴリー毎の集計" value="1" sx={{ background: grey[200] }} />
                <Tab label="各期間の集計" value="2" sx={{ background: grey[200] }} />
                <Tab label="一ヶ月毎の内訳" value="3" sx={{ background: grey[200] }} />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ padding: windowSize ? '0px' : '' }}>
              <AggregationByCategory />
            </TabPanel>
            <TabPanel value="2" sx={{ padding: windowSize ? '0px' : '' }}>
              <AggregationByMonth />
            </TabPanel>
            <TabPanel value="3" sx={{ padding: windowSize ? '0px' : '' }}>
              <AggregationByDetailMonth />
            </TabPanel>
          </TabContext>
        </Paper>
      </Box>
    </>
  );
};

export default React.memo(MonthlyAggregation);
