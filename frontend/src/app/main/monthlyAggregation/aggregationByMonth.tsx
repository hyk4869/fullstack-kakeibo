'use client';

import { TMonthlySpending } from '@/app/_store/slice';
import { RootState } from '@/app/_store/store';
import CommonTableHeader, { commonTableHeaderType } from '@/app/_util/commonTableHeader';
import useWindowSize from '@/app/_util/useWindowSize';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import CustomDate from '../../_customComponents/customDate';
import dayjs from 'dayjs';
import { sumEachMonthlyArray } from '@/app/_util/utilFunctions';

type AggregationByMonthProps = {
  //
};

export type MonthlyGrouping = {
  [month: string]: { data: TMonthlySpending[]; totalUsageFee: number };
};

const AggregationByMonth: React.FC<AggregationByMonthProps> = () => {
  const { width, height } = useWindowSize();
  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const [groupingMonthly, setGroupingMonthly] = useState<MonthlyGrouping>({});

  useEffect(() => {
    if (width < 1100) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width]);

  useEffect(() => {
    setGroupingMonthly(sumEachMonthlyArray(monthlyData));
  }, [monthlyData]);

  /** ヘッダー */
  const headerList: commonTableHeaderType[] = [
    {
      id: 'date',
      label: '日付',
    },
    {
      id: 'amount',
      label: '金額',
    },
    // ...categoryData.map((a) => {
    //   return {
    //     id: a.categoryId !== undefined && a.categoryId !== null ? a.categoryId.toString() : String(a.categoryId),
    //     label: a.categoryName as string,
    //   };
    // }),
  ];

  const changeValue = () => {
    //
  };

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
            gap: '30px',
          }}
        >
          <Table sx={{ width: windowSize ? '100%' : '100%' }}>
            <CommonTableHeader categoryHeaderList={headerList} />
            <TableBody>
              {Object.entries(groupingMonthly).map(([monthKey, data]) => {
                return (
                  <React.Fragment key={monthKey}>
                    <TableRow>
                      <TableCell align="center">
                        <CustomDate
                          value={dayjs(monthKey)}
                          edit={false}
                          onChangeValue={changeValue}
                          paramKey={'paymentDay'}
                          id={Number(0)}
                          format="YYYY年MM月"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <CustomNumberFormat
                          value={data.totalUsageFee}
                          suffix=" 円"
                          edit={false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'totalAmount'}
                          id={Number(1)}
                        />
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default React.memo(AggregationByMonth);
