'use client';
import CustomTextfield from '@/app/_customComponents/customTextfield';
import CustomNumberFormat from '@/app/_customComponents/customNumeric';
import { RootState } from '@/app/_store/store';
import { Box, TableBody, TableCell, TableContainer, TableRow, Table } from '@mui/material';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { commonPadding5, messageRedirect } from '@/app/_customComponents/customProperties';
import DoughnutGraph from '@/app/_util/commonGraph/doughnutGraph';
import useWindowSize from '@/app/_util/useWindowSize';
import CustomToggleButton from '@/app/_customComponents/customToggleButton';
import BarGraph, { AmoutType } from '@/app/_util/commonGraph/barGraph';
import RedirectDialog from '@/app/_util/commonLayouts/redirectDialog';
import CommonTableHeader from '@/app/_util/commonLayouts/commonTableHeader';
import { getLatestDate, getOldDate, sumAmount, sumEachCategoryByMonthly } from '@/app/_util/utils';
import CommonFooterAggregation from './commonFooter';
import { aggregationHeaderList } from '@/app/_util/commonLayouts/headerList';
import ChangeAggregationMonth from './changeDate';
import { TMonthlySpending } from '@/app/_store/interfacesInfo';
import { toggleButtonList } from './aggregationByCategory';

type AggregationByDetailMonthProps = {
  //
};

export type SortedDateType = {
  startDate: Date | null;
  endDate: Date | null;
};

export type SelectDate = {
  year: number | null;
  month: number | null;
};

const defaultDate = new Date();
const defaultYear = defaultDate.getFullYear();
const defaultMonth = defaultDate.getMonth();

const defaultValue = {
  year: defaultYear,
  month: defaultMonth,
};

/** 一ヶ月毎の内訳集計 */
const AggregationByDetailMonth: React.FC<AggregationByDetailMonthProps> = () => {
  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);
  const { width, height } = useWindowSize();
  const [amount, setAmount] = useState<Array<AmoutType>>([]);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const [displayGraph, setDisplayGraph] = useState<string>('1');
  const [redirectTo, setRedirectTo] = useState<boolean>(false);
  const [sortedDate, setSortedDate] = useState<SortedDateType>();
  const [selectedDate, setSelectedDate] = useState<SelectDate>(defaultValue);

  useLayoutEffect(() => {
    if (monthlyData.length === 0) {
      setRedirectTo(true);
    }
  }, [monthlyData]);

  useEffect(() => {
    setAmount(sumEachCategoryByMonthly(displayData(selectedDate)));

    setSortedDate({
      startDate: getOldDate(monthlyData),
      endDate: getLatestDate(monthlyData),
    });
  }, [categoryData, monthlyData, selectedDate]);

  useEffect(() => {
    if (width < 1100) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width]);

  const changeValue = useCallback(
    (id: number, paramKey: string, value: unknown): void => {
      switch (paramKey) {
        case 'toggleValue':
          typeof value === 'string' ? setDisplayGraph(value) : setDisplayGraph(String(value));
          break;
      }
    },
    [displayGraph],
  );

  /**
   * 一ヶ月毎の内訳計算
   */
  const displayData = useCallback(
    (selectedDate: SelectDate): TMonthlySpending[] => {
      const result = monthlyData.filter(
        (a) => a.paymentDay?.getFullYear() === selectedDate.year && a.paymentDay.getMonth() + 1 === selectedDate.month,
      );
      return result;
    },
    [monthlyData, selectedDate],
  );

  return (
    <>
      <Box>
        <ChangeAggregationMonth
          monthlyData={monthlyData}
          categoryData={categoryData}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <TableContainer
          sx={{
            display: windowSize ? 'block' : 'flex',
            flexDirection: windowSize ? '' : 'row',
            justifyContent: 'center',
            width: '100%',
            height: windowSize ? `${height - height * 0.25}px` : '65vh',
          }}
        >
          <Table sx={{ width: windowSize ? '100%' : '50%', height: '60vh' }}>
            <CommonTableHeader categoryHeaderList={aggregationHeaderList} />
            <TableBody>
              {amount.map((a) => {
                return (
                  <TableRow key={a.categoryId} sx={{ padding: commonPadding5 }}>
                    <TableCell align="center" sx={{ padding: commonPadding5 }}>
                      <CustomTextfield
                        value={a.categoryName}
                        edit={false}
                        onChangeValue={changeValue}
                        paramKey={'categoryName'}
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
                    value={sumAmount(amount.map((a) => a.totalAmount))}
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
              <DoughnutGraph<AmoutType> value={amount} title={'カテゴリー別の金額'} />
            ) : (
              <BarGraph AmoutType={amount} title={'カテゴリー別の金額'} label={'categoryName'} />
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CustomToggleButton
                edit={true}
                valueObj={toggleButtonList}
                value={displayGraph}
                onChangeValue={changeValue}
                paramkey="toggleValue"
                id={1}
              />
            </Box>
          </Box>
        </TableContainer>
        <CommonFooterAggregation sortedDate={sortedDate} />
      </Box>

      <RedirectDialog
        openRedirect={redirectTo}
        closeRedirect={() => setRedirectTo(false)}
        url="/main/summaryTable"
        message={messageRedirect}
      />
    </>
  );
};

export default React.memo(AggregationByDetailMonth);
