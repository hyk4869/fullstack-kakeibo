'use client';

import { MonthlySpending } from '@/interfaces/monthlySpending';
import { Button } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const ApiTest = () => {
  const [apiBox, setApiBox] = useState<Array<MonthlySpending>>([]);

  const handleClickAPI = () => {
    axios
      .get('http://localhost:3005/monthly-spending')
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setApiBox(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div>
        <Button variant='contained' onClick={handleClickAPI}>
          API TEST
        </Button>
        <br />
        {apiBox && <div>{apiBox.map((a) => a.store)}</div>}
      </div>
    </>
  );
};

export default ApiTest;
