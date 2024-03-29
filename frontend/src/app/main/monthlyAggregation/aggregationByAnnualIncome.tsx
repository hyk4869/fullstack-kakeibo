'use client';

import { RootState } from '@/app/_store/store';
import CommonTableHeader from '@/app/_util/commonLayouts/commonTableHeader';
import useWindowSize from '@/app/_util/useWindowSize';
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import { getLatestSalaryDate, getOldSalaryDate } from '@/app/_util/utils';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import CommonFooterAggregation from './commonFooter';
import { SortedDateType } from './aggregationByCategory';
import BarGraph, { AmoutType } from '@/app/_util/commonGraph/barGraph';
import { aggregationAnnualSalaryHeaderList } from '@/app/_util/commonLayouts/headerList';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getAllIncomeLink } from '@/app/_api/url';
import { setBonusContent, setBonusTaxContent, setSalaryContent, setSalaryTaxContent } from '@/app/_store/slice';
import { useGeneratePDF } from '@/app/_util/generatePDF/useGeneratePDF';
import { aggregationByAnnualIncomePDF } from '@/app/_util/generatePDF/aggregate/aggregationByAnnualIncomePDF';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

type AggregationByAnnualIncomeProps = {
  //
};

export interface AmountTypeWithTax extends AmoutType {
  annualTax: number | null;
  taxPercentage: number | null;
  disposableIncome: number | null;
}

/** 年収の集計 */
const AggregationByAnnualIncome: React.FC<AggregationByAnnualIncomeProps> = () => {
  const { width, height } = useWindowSize();
  const salaryData = useSelector((state: RootState) => state.getSalary);
  const salaryTaxData = useSelector((state: RootState) => state.getSalaryTax);
  const bonusData = useSelector((state: RootState) => state.getBonus);
  const bonusTaxData = useSelector((state: RootState) => state.getBonusTax);
  const userData = useSelector((state: RootState) => state.getUserInfo);

  const [windowSize, setWindowSize] = useState<boolean>(false);
  const [amount, setAmount] = useState<Array<AmoutType>>([]);
  const [sortedDate, setSortedDate] = useState<SortedDateType>();
  const [displayGraph, setDisplayGraph] = useState<string>('1');
  const [arrayAmount, setArrayAmount] = useState<Array<AmountTypeWithTax>>([]);
  const [barImageURL, setBarImageURL] = useState<string>('');

  const jwtToken = Cookies.get('authToken');
  const dispatch = useDispatch();
  const { createOpenPDF } = useGeneratePDF();

  useEffect(() => {
    if (salaryData.length === 0 || salaryTaxData.length === 0 || bonusData.length === 0 || bonusTaxData.length === 0) {
      try {
        axios
          .get(getAllIncomeLink, {
            params: {
              userID: userData.userID,
            },
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
          .then((res) => {
            if (res.data) {
              const data = res.data;
              dispatch(setSalaryTaxContent(data.salaryTaxData));
              dispatch(setSalaryContent(data.salaryData));
              dispatch(setBonusTaxContent(data.bonusTaxData));
              dispatch(setBonusContent(data.bonusData));
            }
          });
      } catch (error) {
        console.error(error);
      }
    }
  }, [salaryData, salaryTaxData, bonusData, bonusTaxData]);

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
  const displayData = useCallback((): AmoutType[] => {
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

    const result = newAmount.sort((a, b) => (a.categoryId || 0) - (b.categoryId || 0));

    const calculatedTax: {
      [categoryId: number]: { annualTax: number; taxPercentage: number; disposableIncome: number };
    } = {};

    const renameValue = bonusTaxData
      .map((a) => {
        return { ...a, TSalary: a.TBonus };
      })
      .map(({ TBonus, ...s }) => {
        return s;
      });

    const annualTaxArray = [...salaryTaxData, ...renameValue];

    annualTaxArray.forEach((s) => {
      const payday = s.TSalary?.[0]?.payday;

      const categoryId = (payday instanceof Date ? payday : new Date(payday!.toString())).getFullYear();

      if (s.id !== null) {
        calculatedTax[categoryId] = {
          annualTax:
            (calculatedTax[categoryId]?.annualTax || 0) +
            (s.employeeInsuranceExpense ?? 0) +
            (s.employeePensionInsuranceExpense ?? 0) +
            (s.healthInsuranceExpense ?? 0) +
            (s.incomeTax ?? 0) +
            (s.longTermCareInsurance ?? 0) +
            (s.nationalPensionInsuranceExpense ?? 0) +
            (s.notes ?? 0) +
            (s.residenceTax ?? 0) +
            (s.yearEndAdjustment ?? 0),
          taxPercentage: 0,
          disposableIncome: 0,
        };
      }
    });

    const mergedAmount: { [categoryId: number]: AmoutType & AmountTypeWithTax } = {};

    const value = newAmount.map((a) => {
      const categoryId = a.categoryId || 0;
      const existingAmount = mergedAmount[categoryId] || {};

      return {
        ...existingAmount,
        ...a,
        //   ...calculatedTax[categoryId],
        annualTax: calculatedTax[categoryId]?.annualTax ?? 0,
        taxPercentage: calculatedTax[categoryId]?.annualTax
          ? Math.round((calculatedTax[categoryId]?.annualTax / a.totalAmount!) * 1000) / 10
          : 0,
        disposableIncome: calculatedTax[categoryId]?.annualTax
          ? a.totalAmount! - calculatedTax[categoryId]?.annualTax
          : 0,
      };
    });

    setArrayAmount(value);
    return result;
  }, [amount, arrayAmount]);

  const generatePDF = useCallback(async () => {
    return await createOpenPDF(aggregationByAnnualIncomePDF(arrayAmount, sortedDate, barImageURL)).finally();
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
            <CommonTableHeader categoryHeaderList={aggregationAnnualSalaryHeaderList} />
            <TableBody>
              {arrayAmount
                .sort((a, b) => (Number(a.categoryId) < Number(b.categoryId) ? -1 : 1))
                .map((a) => {
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
                          thousandSeparator={false}
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
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.annualTax}
                          suffix=" 円"
                          edit={false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'annualTax'}
                          id={Number(a.categoryId)}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.taxPercentage}
                          suffix=" %"
                          edit={false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'taxPercentage'}
                          id={Number(a.categoryId)}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.disposableIncome}
                          suffix=" 円"
                          edit={false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'disposableIncome'}
                          id={Number(a.categoryId)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          <Box sx={{ width: windowSize ? '100%' : '50%', display: 'grid', justifyContent: 'center' }}>
            {displayGraph === '1' ? (
              <BarGraph AmoutType={amount} title={'年収推移'} label={'categoryName'} setBarImageURL={setBarImageURL} />
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

export default React.memo(AggregationByAnnualIncome);
