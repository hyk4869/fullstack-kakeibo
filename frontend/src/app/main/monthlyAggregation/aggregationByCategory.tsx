'use client';
import CustomTextfield from '@/app/_customComponents/customTextfield';
import CustomNumberFormat from '@/app/_customComponents/customNumeric';
import { RootState } from '@/app/_store/store';
import { Box, TableBody, TableCell, TableContainer, TableRow, Table, TableHead } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomDate from '@/app/_customComponents/customDate';
import { commonFontSize, commonPadding5 } from '@/app/_customComponents/customProperties';
import DoughnutChart from '@/app/_util/doughnutChart';
import useWindowSize from '@/app/_util/useWindowSize';

type AggregationByCategoryProps = {
  //
};
/** ヘッダー用の型 */
type AggregationByCategoryHeader = {
  title: string;
  disablePadding: boolean;
  label: string;
};

/** 合計金額用の型 */
export type amoutType = {
  totalAmount: number | null;
  categoryId: number | null;
  categoryName: string | null;
};

type sortedDateType = {
  startDate: Date | null;
  endDate: Date | null;
};

/** ヘッダー */
const headerList: AggregationByCategoryHeader[] = [
  {
    title: 'category',
    disablePadding: false,
    label: 'カテゴリー名',
  },
  {
    title: 'Amount',
    disablePadding: false,
    label: '金額',
  },
];

/** カテゴリーごとの集計 */
const AggregationByCategory: React.FC<AggregationByCategoryProps> = () => {
  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);
  const { width, height } = useWindowSize();
  const [amount, setAmount] = useState<Array<amoutType>>([]);
  const [sortedDate, setSortedDate] = useState<sortedDateType>();
  const [windowSize, setWindowSize] = useState<boolean>(false);

  useEffect(() => {
    const categoryTotal: { [categoryId: number]: { total: number; categoryName?: string } } = {};

    monthlyData.forEach((d) => {
      const categoryId = d.categoryId;
      const usageFee = d.usageFee || 0;
      const categoryName = d.category?.categoryName;

      if (categoryId !== null) {
        categoryTotal[categoryId] = {
          total: (categoryTotal[categoryId]?.total || 0) + usageFee,
          categoryName: categoryName ?? '',
        };
      }
    });

    const newAmount: amoutType[] = Object.entries(categoryTotal).map(([categoryId, { total, categoryName }]) => ({
      categoryId: parseInt(categoryId, 10) ?? null,
      totalAmount: total ?? null,
      categoryName: categoryName ?? null,
    }));

    setAmount(newAmount);

    const getLatestDate = (): Date => {
      const latestDate = new Date(Math.max(...monthlyData.map((date) => date.paymentDay?.getTime() || 0)));
      return latestDate;
    };

    const getOldDate = (): Date => {
      const latestDate = new Date(Math.min(...monthlyData.map((date) => date.paymentDay?.getTime() || 0)));
      return latestDate;
    };

    setSortedDate({
      startDate: getOldDate(),
      endDate: getLatestDate(),
    });
  }, [categoryData, monthlyData]);

  const changeValue = useCallback(() => {
    //
  }, []);

  const sumAmount = useCallback((): number => {
    // eslint-disable-next-line prefer-const
    let sum = 0;
    amount.forEach((d) => {
      if (d.totalAmount !== null) {
        sum += d.totalAmount;
      }
    });
    return sum;
  }, [monthlyData, categoryData, amount]);

  useEffect(() => {
    if (width < 1100) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width]);

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
            <TableHead>
              <TableRow sx={{ padding: commonPadding5 }}>
                {headerList.map((a) => {
                  return (
                    <TableCell key={a.title} align={'center'} sx={{ padding: commonPadding5 }}>
                      {a.label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
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
                    paramKey={'categoryName'}
                    id={Number(1)}
                  />
                </TableCell>
                <TableCell align="center" sx={{ padding: commonPadding5 }}>
                  <CustomNumberFormat
                    value={sumAmount()}
                    suffix=" 円"
                    edit={false}
                    align="center"
                    onChangeValue={changeValue}
                    paramKey={'totalAmount'}
                    id={Number(2)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box sx={{ width: windowSize ? '100%' : '50%', display: 'flex', justifyContent: 'center' }}>
            <DoughnutChart value={amount} title={'カテゴリー別の金額'} />
          </Box>
        </TableContainer>
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
      </Box>
    </>
  );
};

export default React.memo(AggregationByCategory);