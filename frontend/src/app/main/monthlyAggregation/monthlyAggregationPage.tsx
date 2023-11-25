'use client';
import { RootState } from '@/app/_store/store';
import React from 'react';
import { useSelector } from 'react-redux';

type MonthlyAggregationProps = {
  //
};
const MonthlyAggregation: React.FC<MonthlyAggregationProps> = () => {
  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);

  return (
    <>
      <div>
        {monthlyData.map((a) => {
          return <div key={a.id}>{a.id}</div>;
        })}
      </div>
    </>
  );
};

export default MonthlyAggregation;
