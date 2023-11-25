'use client';
import { GetServerSidePropsContext } from 'next';
import MonthlyAggregationPage from './monthlyAggregation/page';
import EntryPageSummaryTable from './summaryTable/page';
import React from 'react';

const MainPage = () => {
  return (
    <>
      <EntryPageSummaryTable />
      <MonthlyAggregationPage />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { res } = context;
  if (context.req.url === '/main') {
    res.writeHead(301, { Location: '/' });
    res.end();
  }
  return { props: {} };
}

export default MainPage;
