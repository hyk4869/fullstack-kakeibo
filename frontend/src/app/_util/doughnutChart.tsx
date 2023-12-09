'use client';
import React, { useEffect, useState } from 'react';
import { Chart, registerables, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { color200 } from '../_customComponents/customProperties';
import { Box } from '@mui/material';
import 'chartjs-plugin-datalabels';
import useWindowSize from './useWindowSize';
import { AmoutType } from './barGraph';
Chart.register(...registerables);

type DoughnutChartProps<T> = {
  value: T[];
  title: string;
};

/** ジェネリクスで書いた共通のグラフ */
const DoughnutChart = <T extends AmoutType>(props: DoughnutChartProps<T>): React.ReactElement => {
  const { value, title } = props;

  const sortedChartData = value.sort((a, b) => (Number(a.totalAmount) > Number(b.totalAmount) ? -1 : 1));
  const chartData = sortedChartData.map((s) => s.totalAmount);
  const chartLabel = sortedChartData.map((s) => s.categoryName);
  const { width } = useWindowSize();
  const [windowSize, setWindowSize] = useState<boolean>(false);

  const graphdata = {
    datasets: [
      {
        data: chartData,
        backgroundColor: color200,
      },
    ],
    labels: chartLabel,
  };

  const doughnutOptions: Partial<ChartOptions<'doughnut'>> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      title: { display: true, text: title, font: { weight: 'bold', size: 20 } },
      // tooltip: {
      //   callbacks: {
      //     label: (context: TooltipItem<'doughnut'>) => {
      //       const label = context.label || '';
      //       const value = context.parsed || 0;
      //       const total = context.dataset.data.reduce((acc: number, data: number) => acc + data, 0);
      //       const percentage = ((value / total) * 100).toFixed(2);
      //       return `${label}: ${percentage}%`;
      //     },
      //   },
      // },
    },
    cutout: '40%',
  };

  useEffect(() => {
    if (width < 640) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width]);

  return (
    <Box sx={{ width: windowSize ? 300 : 500, height: windowSize ? 300 : 500 }}>
      <Doughnut data={graphdata} options={doughnutOptions} />
    </Box>
  );
};

export default DoughnutChart;
