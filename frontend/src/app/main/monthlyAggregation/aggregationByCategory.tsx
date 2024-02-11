'use client';
import CustomTextfield from '@/app/_customComponents/customTextfield';
import CustomNumberFormat from '@/app/_customComponents/customNumeric';
import { RootState } from '@/app/_store/store';
import { Box, TableBody, TableCell, TableContainer, TableRow, Table, Tooltip, IconButton } from '@mui/material';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { commonPadding5, messageRedirect } from '@/app/_customComponents/customProperties';
import DoughnutGraph from '@/app/_util/commonGraph/doughnutGraph';
import useWindowSize from '@/app/_util/useWindowSize';
import CustomToggleButton from '@/app/_customComponents/customToggleButton';
import { ValueObjType } from '@/app/_customComponents/customRadioButton';
import BarGraph, { AmoutType } from '@/app/_util/commonGraph/barGraph';
import RedirectDialog from '@/app/_util/commonLayouts/redirectDialog';
import CommonTableHeader from '@/app/_util/commonLayouts/commonTableHeader';
import { getLatestDate, getOldDate, sumAmount, sumEachCategoryByMonthly } from '@/app/_util/utils';
import CommonFooterAggregation from './commonFooter';
import { aggregationHeaderList } from '@/app/_util/commonLayouts/headerList';
import { useGeneratePDF } from '@/app/_util/generatePDF/useGeneratePDF';
import { aggregationByCategoryPDF } from '@/app/_util/generatePDF/aggregate/aggregationByCategoryPDF';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

type AggregationByCategoryProps = {
  //
};

export type SortedDateType = {
  startDate: Date | null;
  endDate: Date | null;
};

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
  const [sortedDate, setSortedDate] = useState<SortedDateType>({ startDate: null, endDate: null });
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const [displayGraph, setDisplayGraph] = useState<string>('1');
  const [redirectTo, setRedirectTo] = useState<boolean>(false);

  const [doughnutImageURL, setDoughnutImageURL] = useState<string>('');
  const [barImageURL, setBarImageURL] = useState<string>('');

  const { createOpenPDF } = useGeneratePDF();

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
    [displayGraph, doughnutImageURL, barImageURL, amount],
  );

  const generatePDF = useCallback(async () => {
    if (displayGraph === '1') {
      return await createOpenPDF(aggregationByCategoryPDF(amount, sortedDate, doughnutImageURL)).finally();
    } else if (displayGraph === '2') {
      return await createOpenPDF(aggregationByCategoryPDF(amount, sortedDate, barImageURL)).finally();
    }
  }, [doughnutImageURL, barImageURL, sortedDate]);

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
            <CommonTableHeader categoryHeaderList={aggregationHeaderList} />
            <TableBody>
              {amount
                .sort((a, b) => (Number(a.totalAmount) > Number(b.totalAmount) ? -1 : 1))
                .map((a) => {
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
              <DoughnutGraph<AmoutType>
                value={amount}
                title={'カテゴリー別の金額'}
                setDoughnutImageURL={setDoughnutImageURL}
              />
            ) : (
              <BarGraph
                AmoutType={amount}
                title={'カテゴリー別の金額'}
                label={'categoryName'}
                setBarImageURL={setBarImageURL}
              />
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
          <Tooltip title="データをPDFとしてダウンロード" arrow>
            <IconButton onClick={generatePDF} size="medium" sx={{ ':hover': { color: 'primary.main' } }}>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>

          <CommonFooterAggregation sortedDate={sortedDate} />
        </Box>
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
