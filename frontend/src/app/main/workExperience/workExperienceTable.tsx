'use client';

import { getCompany, getHireDate } from '@/app/_api/url';
import { setCompanyContent, setHireDateContent } from '@/app/_store/slice';
import { RootState } from '@/app/_store/store';
import CommonTableHeader, { commonTableHeaderType } from '@/app/_util/commonTableHeader';
import useWindowSize from '@/app/_util/useWindowSize';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingContent from '../../_util/loading';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import { grey } from '@mui/material/colors';

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
    try {
      if (companyData.length === 0 && hireDateData.length === 0) {
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
    } catch (error) {
      console.error(error);
    }
  }, [companyData, hireDateData]);

  console.log(companyData, hireDateData);

  useEffect(() => {
    if (width < 1100) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width]);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '95%', margin: '0.5rem auto', background: grey[50] }}>
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
                    <TableRow key={a.id} sx={{ padding: commonPadding5 }}>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        {a.id}
                      </TableCell>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        {a.name}
                      </TableCell>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        {a.majorSector}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
    </>
  );
};

export default React.memo(WorkExperienceTable);
