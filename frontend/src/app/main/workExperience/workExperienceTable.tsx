'use client';

import { getCompany, getHireDate } from '@/app/_api/url';
import { setCompanyContent, setHireDateContent } from '@/app/_store/slice';
import { RootState } from '@/app/_store/store';
import CommonTableHeader, { commonTableHeaderType } from '@/app/_util/commonTableHeader';
import useWindowSize from '@/app/_util/useWindowSize';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingContent from '../../_util/loading';

type WorkExperienceTableProps = {
  //
};

const headerList: commonTableHeaderType[] = [
  {
    id: 'id',
    label: 'id',
  },
  {
    id: 'name',
    label: '会社名',
  },
  {
    id: 'majorSector',
    label: '大分類',
  },
];

const WorkExperienceTable: React.FC<WorkExperienceTableProps> = () => {
  const companyData = useSelector((state: RootState) => state.getCompanyContent);
  const hireDateData = useSelector((state: RootState) => state.getHireDate);
  const { width, height } = useWindowSize();
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (companyData.length !== 0 || hireDateData.length !== 0) {
      setIsLoading(true);
      axios
        .get(getCompany)
        .then((res) => {
          if (res.data) {
            dispatch(setCompanyContent(res.data));
          }
          return axios.get(getHireDate);
        })
        .then((res) => {
          if (res.data) {
            dispatch(setHireDateContent(res.data));
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [companyData, hireDateData]);

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
          }}
        >
          <Table sx={{ width: windowSize ? '100%' : '50%' }}>
            <CommonTableHeader categoryHeaderList={headerList} />
            <TableBody>
              {companyData.map((a) => {
                return (
                  <TableRow key={a.id}>
                    <TableCell>{a.id}</TableCell>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.majorSector}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
    </>
  );
};

export default React.memo(WorkExperienceTable);
