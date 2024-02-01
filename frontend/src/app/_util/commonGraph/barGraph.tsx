import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables, ChartOptions } from 'chart.js';
import { color200 } from '../../_customComponents/customProperties';
import { Bar } from 'react-chartjs-2';
import { Box } from '@mui/material';
import useWindowSize from '../useWindowSize';
import { TMonthlySpending } from '../../_store/interfacesInfo';

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
  setBarImageURL?: React.Dispatch<React.SetStateAction<string>>;
};

/** ジェネリクスで書いた共通のグラフ（修正必要） */
const BarGraph = <T extends AmoutType, U extends MonthlyGrouping>(props: BarGraphProps<T, U>) => {
  const { AmoutType, MonthlyGrouping, title, label, setBarImageURL } = props;
  const { width, height } = useWindowSize();
  const [windowSize, setWindowSize] = useState<boolean>(false);

  const chartRef = useRef<Chart<'bar', (number | null)[], string | null> | null>(null);

  useEffect(() => {
    if (width < 640) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width]);

  useEffect(() => {
    if (chartRef.current && setBarImageURL) {
      const chartInstance = chartRef.current;
      chartInstance.options.animation = {
        ...chartInstance.options.animation,
        onComplete: () => {
          const canvas = chartInstance.canvas;
          const imageUrl = canvas.toDataURL('image/png');
          setBarImageURL(imageUrl);
        },
      };
    }
  }, [chartRef]);

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
            ? AmoutType?.sort((a, b) => (Number(a.totalAmount) > Number(b.totalAmount) ? -1 : 1)).map(
                (a) => a.totalAmount ?? null,
              )
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
      <Box sx={{ width: windowSize ? 300 : 470, height: windowSize ? 300 : 470 }}>
        <Bar data={graphData} options={options} ref={chartRef} />
      </Box>
    </>
  );
};

export default BarGraph;
