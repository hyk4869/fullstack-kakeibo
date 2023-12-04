import React, { useEffect, useState } from 'react';
import { AmoutType } from '../main/monthlyAggregation/aggregationByCategory';
import { Chart, registerables, ChartOptions } from 'chart.js';
import { color200 } from '../_customComponents/customProperties';
import { Bar } from 'react-chartjs-2';
import { Box } from '@mui/material';
import useWindowSize from './useWindowSize';

Chart.register(...registerables);

type BarGraphProps<T> = {
  value: T[];
  title: string;
};
const BarGraph: React.FC<BarGraphProps<AmoutType>> = (props) => {
  const { value, title } = props;
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
    labels: value.map((a) => a.categoryName),
    datasets: [
      {
        label: title,
        data: value.map((a) => a.totalAmount),
        backgroundColor: color200.map((a) => a),
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        labels: value.map((a) => a.categoryName!),
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

export default React.memo(BarGraph);
