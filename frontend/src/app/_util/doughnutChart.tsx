'use client';
import React from 'react';
import { amoutType } from '../main/monthlyAggregation/aggregationByCategory';
import { Chart, registerables, ChartOptions, TooltipItem } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { color200 } from '../_customComponents/customProperties';
import { Box } from '@mui/material';
import 'chartjs-plugin-datalabels';
Chart.register(...registerables);

type DoughnutChartProps<T> = {
  value: T[];
  //   somethiong?: U[]
};

const DoughnutChart: React.FC<DoughnutChartProps<amoutType>> = (props) => {
  const { value } = props;

  const sortedChartData = value.sort((a, b) => (Number(a.totalAmount) > Number(b.totalAmount) ? -1 : 1));
  const chartData = sortedChartData.map((s) => s.totalAmount);
  const chartLabel = sortedChartData.map((s) => s.categoryName);

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
      title: { display: true, text: 'カテゴリー別の金額', font: { weight: 'bold', size: 20 } },
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

  return (
    <Box sx={{ width: 520, height: 520 }}>
      <Doughnut data={graphdata} options={doughnutOptions} />
    </Box>
  );
};

export default React.memo(DoughnutChart);
