'use client';
import CustomTextfield from '@/app/_customComponents/customTextfield';
import CustomNumberFormat from '@/app/_customComponents/customNumeric';
import { RootState } from '@/app/_store/store';
import { Box, TableBody, TableCell, TableContainer, TableRow, Table } from '@mui/material';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { commonPadding5, messageRedirect } from '@/app/_customComponents/customProperties';
import DoughnutChart from '@/app/_util/doughnutChart';
import useWindowSize from '@/app/_util/useWindowSize';
import CustomToggleButton from '@/app/_customComponents/customToggleButton';
import { ValueObjType } from '@/app/_customComponents/customRadioButton';
import BarGraph from '@/app/_util/barGraph';
import RedirectDialog from '@/app/_util/redirectDialog';
import CommonTableHeader, { commonTableHeaderType } from '@/app/_util/commonTableHeader';
import { getLatestDate, getOldDate, sumAmount, sumEachCategoryByMonthly } from '@/app/_util/utilFunctions';
import CommonFooterAggregation from './commonFooter';

type AggregationByCategoryProps = {
  //
};

/** 合計金額用の型 */
export type AmoutType = {
  totalAmount: number | null;
  categoryId: number | null;
  categoryName: string | null;
};

export type SortedDateType = {
  startDate: Date | null;
  endDate: Date | null;
};

/** ヘッダー */
const headerList: commonTableHeaderType[] = [
  {
    id: 'category',
    label: 'カテゴリー名',
  },
  {
    id: 'amount',
    label: '金額',
  },
];

export const toggleButtonList: ValueObjType[] = [
  {
    label: '円グラフ',
    value: '1',
  },
  {
    label: '棒グラフ',
    value: '2',
  },
];

/** カテゴリーごとの集計 */
const AggregationByCategory: React.FC<AggregationByCategoryProps> = () => {
  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);
  const { width, height } = useWindowSize();
  const [amount, setAmount] = useState<Array<AmoutType>>([]);
  const [sortedDate, setSortedDate] = useState<SortedDateType>();
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const [displayGraph, setDisplayGraph] = useState<string>('1');
  const [redirectTo, setRedirectTo] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (monthlyData.length === 0) {
      setRedirectTo(true);
    }
  }, [monthlyData]);

  useEffect(() => {
    setAmount(sumEachCategoryByMonthly(monthlyData));

    setSortedDate({
      startDate: getOldDate(monthlyData),
      endDate: getLatestDate(monthlyData),
    });
  }, [categoryData, monthlyData]);

  useEffect(() => {
    if (width < 1100) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width]);

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
            <CommonTableHeader categoryHeaderList={headerList} />
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
            </TableBody>

            <TableBody>
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
              <DoughnutChart value={amount} title={'カテゴリー別の金額'} />
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

export default React.memo(AggregationByCategory);
