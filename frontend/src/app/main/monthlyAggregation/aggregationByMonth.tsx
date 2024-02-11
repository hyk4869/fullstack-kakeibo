'use client';

import { RootState } from '@/app/_store/store';
import CommonTableHeader from '@/app/_util/commonLayouts/commonTableHeader';
import useWindowSize from '@/app/_util/useWindowSize';
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import CustomDate from '../../_customComponents/customDate';
import dayjs from 'dayjs';
import { calcAvg, getLatestDate, getOldDate, sumAmount, sumEachMonthlyArray } from '@/app/_util/utils';
import CustomTextfield from '@/app/_customComponents/customTextfield';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import CommonFooterAggregation from './commonFooter';
import { SortedDateType } from './aggregationByCategory';
import BarGraph, { MonthlyGrouping } from '@/app/_util/commonGraph/barGraph';
import { aggregationMonthlyHeaderList } from '@/app/_util/commonLayouts/headerList';
import { useGeneratePDF } from '@/app/_util/generatePDF/useGeneratePDF';
import { aggregationByMonthPDF } from '@/app/_util/generatePDF/aggregate/aggregationByMonthPDF';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

type AggregationByMonthProps = {
  //
};

/** 各期間の集計 */
const AggregationByMonth: React.FC<AggregationByMonthProps> = () => {
  const { width, height } = useWindowSize();
  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const [groupingMonthly, setGroupingMonthly] = useState<MonthlyGrouping>({});
  const [sortedDate, setSortedDate] = useState<SortedDateType>();
  const [displayGraph, setDisplayGraph] = useState<string>('1');
  const [barImageURL, setBarImageURL] = useState<string>('');

  const { createOpenPDF } = useGeneratePDF();

  useEffect(() => {
    if (width < 1100) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width]);

  useEffect(() => {
    setGroupingMonthly(sumEachMonthlyArray(monthlyData));

    setSortedDate({
      startDate: getOldDate(monthlyData),
      endDate: getLatestDate(monthlyData),
    });
  }, [monthlyData]);

  const changeValue = useCallback(
    (id: number, paramKey: string, value: unknown) => {
      switch (paramKey) {
        case 'toggleValue':
          typeof value === 'string' ? setDisplayGraph(value) : setDisplayGraph(String(value));
          break;
      }
    },
    [displayGraph],
  );

  const generatePDF = useCallback(async () => {
    return await createOpenPDF(aggregationByMonthPDF(groupingMonthly, sortedDate, barImageURL)).finally();
  }, [barImageURL, sortedDate]);

  return (
    <>
      <Box>
        <TableContainer
          sx={{
            display: windowSize ? 'block' : 'flex',
            flexDirection: windowSize ? '' : 'row',
            justifyContent: 'center',
            width: '100%',
            height: windowSize ? `${height - height * 0.25}px` : '70vh',
          }}
        >
          <Table sx={{ width: windowSize ? '100%' : '50%' }}>
            <CommonTableHeader categoryHeaderList={aggregationMonthlyHeaderList} />
            <TableBody>
              {Object.entries(groupingMonthly)
                .sort(([a], [b]) => dayjs(a).diff(dayjs(b)))
                .map(([monthKey, data]) => {
                  return (
                    <React.Fragment key={monthKey}>
                      <TableRow sx={{ padding: commonPadding5 }}>
                        <TableCell align="center" sx={{ padding: commonPadding5 }}>
                          <CustomDate
                            value={dayjs(monthKey)}
                            edit={false}
                            onChangeValue={changeValue}
                            paramKey={'paymentDay'}
                            id={monthKey.length}
                            format="YYYY年MM月"
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ padding: commonPadding5 }}>
                          <CustomNumberFormat
                            value={data.totalUsageFee}
                            suffix=" 円"
                            edit={false}
                            align="center"
                            onChangeValue={changeValue}
                            paramKey={'totalAmount'}
                            id={monthKey.length}
                          />
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}

              <TableRow sx={{ padding: commonPadding5 }}>
                <TableCell align="center" sx={{ padding: commonPadding5 }}>
                  <CustomTextfield
                    value={'平均金額'}
                    edit={false}
                    onChangeValue={changeValue}
                    paramKey={'averageString'}
                    id={Number(1)}
                  />
                </TableCell>
                <TableCell align="center" sx={{ padding: commonPadding5 }}>
                  <CustomNumberFormat
                    value={calcAvg(Object.entries(groupingMonthly).map(([_, b]) => b.totalUsageFee))}
                    suffix=" 円"
                    edit={false}
                    align="center"
                    onChangeValue={changeValue}
                    paramKey={'averageAmount'}
                    id={Number(2)}
                  />
                </TableCell>
              </TableRow>
              <TableRow sx={{ padding: commonPadding5 }}>
                <TableCell align="center" sx={{ padding: commonPadding5 }}>
                  <CustomTextfield
                    value={'合計金額'}
                    edit={false}
                    onChangeValue={changeValue}
                    paramKey={'sumAmountString'}
                    id={Number(1)}
                  />
                </TableCell>
                <TableCell align="center" sx={{ padding: commonPadding5 }}>
                  <CustomNumberFormat
                    value={sumAmount(Object.entries(groupingMonthly).map(([_, b]) => b.totalUsageFee))}
                    suffix=" 円"
                    edit={false}
                    align="center"
                    onChangeValue={changeValue}
                    paramKey={'sumAmount'}
                    id={Number(2)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box sx={{ width: windowSize ? '100%' : '50%', display: 'grid', justifyContent: 'center' }}>
            {displayGraph === '1' ? (
              <BarGraph
                MonthlyGrouping={groupingMonthly}
                title={'一ヶ月の支出'}
                label={'paymentDay'}
                setBarImageURL={setBarImageURL}
              />
            ) : (
              <></>
            )}
          </Box>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
          <Tooltip title="データをPDFとしてダウンロード" arrow>
            <IconButton onClick={generatePDF} size="medium" sx={{ ':hover': { color: 'primary.main' } }}>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
          <CommonFooterAggregation sortedDate={sortedDate} />
        </Box>
      </Box>
    </>
  );
};

export default React.memo(AggregationByMonth);
