'use client';

import { RootState } from '@/app/_store/store';
import CommonTableHeader, { commonTableHeaderType } from '@/app/_util/commonTableHeader';
import useWindowSize from '@/app/_util/useWindowSize';
import { Box, Table, TableContainer } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

type AggregationByMonthProps = {
  //
};

const AggregationByMonth: React.FC<AggregationByMonthProps> = () => {
  const { width, height } = useWindowSize();
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);
  const [windowSize, setWindowSize] = useState<boolean>(false);

  /** ヘッダー */
  const headerList: commonTableHeaderType[] = [
    {
      id: 'date',
      label: '日付',
    },
    {
      id: 'amount',
      label: '金額',
    },
    ...categoryData.map((a) => {
      return {
        id: a.categoryId !== undefined ? a.categoryId!.toString() : (a.categoryId as string),
        label: a.categoryName as string,
      };
    }),
  ];

  useEffect(() => {
    if (width < 1100) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width]);

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
            gap: '30px',
          }}
        >
          <Table sx={{ width: windowSize ? '100%' : '100%' }}>
            <CommonTableHeader categoryHeaderList={headerList} />
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default React.memo(AggregationByMonth);
