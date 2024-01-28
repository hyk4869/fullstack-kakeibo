'use client';

import { testAPILink } from '@/app/_api/url';
import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

type TestApiPropr = {
  //
};

const TestApi: React.FC<TestApiPropr> = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [value, setValue] = useState<any>();
  const [editValue, setEditValue] = useState<{ userId: string; companyNum: number }>({ userId: 'test', companyNum: 1 });

  const handleClickButton = async () => {
    await axios
      .post(testAPILink, editValue)
      .then((res) => {
        if (res.data) {
          setValue(res.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const displayData: any[] = value?.map((a: any) => a.name).join('、 ');

  const editUserId = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue((prev) => ({
      ...prev,
      userId: e.target.value,
    }));
  };

  const editCompanyNum = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue((prev) => ({
      ...prev,
      companyNum: parseInt(e.target.value, 10) || 0,
    }));
  };

  return (
    <>
      <Box sx={{ paddingTop: '1rem', display: 'flex', gap: '1rem' }}>
        <TextField variant="standard" placeholder="userId" onChange={(e) => editUserId(e)}></TextField>
        <TextField variant="standard" placeholder="companyNum" onChange={(e) => editCompanyNum(e)}></TextField>
        <Button variant="outlined" color="primary" onClick={handleClickButton}>
          APIテスト
        </Button>
      </Box>
      <Box sx={{ paddingTop: '1rem' }}>{`${editValue.userId} のMCompanyの会社名は、、、 ${displayData}`}</Box>
    </>
  );
};

export default TestApi;
