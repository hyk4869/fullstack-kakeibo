import React, { useEffect, useState } from 'react';
import { Chart, registerables, ChartOptions } from 'chart.js';
import { color200 } from '../_customComponents/customProperties';
import { Bar } from 'react-chartjs-2';
import { Box } from '@mui/material';
import useWindowSize from './useWindowSize';
import { TMonthlySpending } from '../_store/interfacesInfo';

Chart.register(...registerables);

/** 合計金額用の型 */
export type AmoutType = {
  totalAmount: number | null;
  categoryId: number | null;
  categoryName: string | null;
};

export type MonthlyGrouping = {
  [month: string]: { data: TMonthlySpending[]; totalUsageFee: number };
};

type BarGraphProps<T, U> = {
  AmoutType?: T[];
  MonthlyGrouping?: U;
  title: string;
  label?: 'categoryName' | 'paymentDay';
};

/** ジェネリクスで書いた共通のグラフ（修正必要） */
const BarGraph = <T extends AmoutType, U extends MonthlyGrouping>(props: BarGraphProps<T, U>) => {
  const { AmoutType, MonthlyGrouping, title, label } = props;
  const { width, height } = useWindowSize();
  const [windowSize, setWindowSize] = useState<boolean>(false);

  useEffect(() => {
    if (width < 640) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width]);

  const graphData = {
    labels:
      label === 'categoryName'
        ? AmoutType?.map((a) => a.categoryName ?? '')
        : Object.entries(MonthlyGrouping ?? {}).map(([a, b]) => a),

    datasets: [
      {
        label: title,
        data:
          label === 'categoryName'
            ? AmoutType?.map((a) => a.totalAmount ?? null)
            : Object.entries(MonthlyGrouping ?? {}).map(([a, b]) => b?.totalUsageFee),

        backgroundColor: color200.map((a) => a),
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        labels:
          label === 'categoryName'
            ? AmoutType?.map((a) => a.categoryName ?? '')
            : Object.entries(MonthlyGrouping ?? {}).map(([a, b]) => a),
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <>
      <Box sx={{ width: windowSize ? 300 : 500, height: windowSize ? 300 : 500 }}>
        <Bar data={graphData} options={options} />
      </Box>
    </>
  );
};

export default BarGraph;
