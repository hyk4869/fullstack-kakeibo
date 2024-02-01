'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { color200 } from '../../_customComponents/customProperties';
import { Box } from '@mui/material';
import 'chartjs-plugin-datalabels';
import useWindowSize from '../useWindowSize';
import { AmoutType } from './barGraph';
Chart.register(...registerables);

type DoughnutGraphProps<T> = {
  value: T[];
  title: string;
  setDoughnutImageURL?: React.Dispatch<React.SetStateAction<string>>;
};

/** ジェネリクスで書いた共通のグラフ */
const DoughnutGraph = <T extends AmoutType>(props: DoughnutGraphProps<T>): React.ReactElement => {
  const { value, title, setDoughnutImageURL } = props;

  const sortedChartData = value.sort((a, b) => (Number(a.totalAmount) > Number(b.totalAmount) ? -1 : 1));
  const chartData = sortedChartData.map((s) => s.totalAmount);
  const chartLabel = sortedChartData.map((s) => s.categoryName);
  const { width } = useWindowSize();
  const [windowSize, setWindowSize] = useState<boolean>(false);

  const chartRef = useRef<Chart<'doughnut', (number | null)[], string | null> | null>(null);

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

  useEffect(() => {
    if (chartRef.current && setDoughnutImageURL) {
      const chartInstance = chartRef.current;
      chartInstance.options.animation = {
        ...chartInstance.options.animation,
        onComplete: () => {
          const canvas = chartInstance.canvas;
          const imageUrl = canvas.toDataURL('image/png');
          setDoughnutImageURL(imageUrl);
        },
      };
    }
  }, [chartRef]);

  return (
    <Box sx={{ width: windowSize ? 300 : 470, height: windowSize ? 300 : 470 }} id="doughnut">
      <Doughnut data={graphdata} options={doughnutOptions} ref={chartRef} />
    </Box>
  );
};

export default DoughnutGraph;
