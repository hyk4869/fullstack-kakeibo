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
  if (context.req.url === '/main') {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }
  return { props: {} };
}

export default MainPage;
