'use client';

import { RootState } from '@/app/_store/store';
import CommonTableHeader from '@/app/_util/commonLayouts/commonTableHeader';
import useWindowSize from '@/app/_util/useWindowSize';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import { getLatestSalaryDate, getOldSalaryDate } from '@/app/_util/utils';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import CommonFooterAggregation from './commonFooter';
import { SortedDateType } from './aggregationByCategory';
import BarGraph, { AmoutType } from '@/app/_util/commonGraph/barGraph';
import { aggregationAnnualSalaryHeaderList } from '@/app/_util/commonLayouts/headerList';

type AggregationByAnnualIncomeProps = {
  //
};

/** 年収の集計 */
const AggregationByAnnualIncome: React.FC<AggregationByAnnualIncomeProps> = () => {
  const { width, height } = useWindowSize();
  const salaryData = useSelector((state: RootState) => state.getSalary);
  const bonusData = useSelector((state: RootState) => state.getBonus);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const [amount, setAmount] = useState<Array<AmoutType>>([]);
  const [sortedDate, setSortedDate] = useState<SortedDateType>();
  const [displayGraph, setDisplayGraph] = useState<string>('1');

  useEffect(() => {
    if (width < 1100) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width]);

  useEffect(() => {
    setAmount(displayData());

    setSortedDate({
      startDate: getOldSalaryDate(salaryData),
      endDate: getLatestSalaryDate(salaryData),
    });
  }, [salaryData]);

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

  /**
   * 年収計算
   */
  const displayData = (): AmoutType[] => {
    const categoryTotal: { [categoryId: number]: { total: number; categoryName?: string } } = {};

    const newBonusArray = bonusData
      .map((a) => {
        return { ...a, salary: a.bonusAmount };
      })
      .map(({ bonusAmount, ...d }) => {
        return d;
      });

    const annualSalaryArray = [...salaryData, ...newBonusArray];

    annualSalaryArray.forEach((d) => {
      const categoryId = (d.payday && d.payday?.getFullYear()) ?? 0;
      const salary = d.salary || 0;
      const categoryName = d.payday?.getFullYear().toString();

      if (salary !== null) {
        categoryTotal[categoryId] = {
          total: (categoryTotal[categoryId]?.total || 0) + salary,
          categoryName: categoryName ?? '',
        };
      }
    });

    const newAmount: AmoutType[] = Object.entries(categoryTotal).map(([categoryId, { total, categoryName }]) => ({
      categoryId: parseInt(categoryId, 10) ?? null,
      totalAmount: total ?? null,
      categoryName: categoryName ?? null,
    }));

    return newAmount.sort((a, b) => (a.categoryId || 0) - (b.categoryId || 0));
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
          }}
        >
          <Table sx={{ width: windowSize ? '100%' : '50%' }}>
            <CommonTableHeader categoryHeaderList={aggregationAnnualSalaryHeaderList} />
            <TableBody>
              {amount.map((a) => {
                return (
                  <TableRow key={a.categoryId} sx={{ padding: commonPadding5 }}>
                    <TableCell align="center" sx={{ padding: commonPadding5 }}>
                      <CustomNumberFormat
                        value={a.categoryId}
                        suffix=" 年"
                        edit={false}
                        align="center"
                        onChangeValue={changeValue}
                        paramKey={'categoryId'}
                        id={Number(a.categoryId)}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ padding: commonPadding5 }}>
                      <CustomNumberFormat
                        value={a.totalAmount}
                        suffix=" 円"
                        edit={false}
                        align="center"
                        onChangeValue={changeValue}
                        paramKey={'totalAmount'}
                        id={Number(a.categoryId)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Box sx={{ width: windowSize ? '100%' : '50%', display: 'grid', justifyContent: 'center' }}>
            {displayGraph === '1' ? <BarGraph AmoutType={amount} title={'年収推移'} label={'categoryName'} /> : <></>}
          </Box>
        </TableContainer>
        <CommonFooterAggregation sortedDate={sortedDate} />
      </Box>
    </>
  );
};

export default React.memo(AggregationByAnnualIncome);
