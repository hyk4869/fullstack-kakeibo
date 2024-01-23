'use client';

import { testAPILink } from '@/app/_api/url';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

type TestApiPropr = {
  //
};

const TestApi: React.FC<TestApiPropr> = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [value, setValue] = useState<any>();

  const postData = { companyNum: 1, userId: 'yuuki' };
  // const postData = { userId: 'yuuki' };

  const handleClickButton = async () => {
    await axios
      .post(testAPILink, postData)
      .then((res) => {
        if (res.data) {
          setValue(res.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  console.log(value);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const displayData: any[] = value?.map((a: any) => a.name).join('、 ');

  return (
    <>
      <Box sx={{ paddingTop: '1rem' }}>
        <Button variant="outlined" color="primary" onClick={handleClickButton}>
          APIテスト
        </Button>
      </Box>
      <Box sx={{ paddingTop: '1rem' }}>{displayData}</Box>
    </>
  );
};

export default TestApi;
