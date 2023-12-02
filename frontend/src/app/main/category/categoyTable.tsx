'use client';
import { RootState } from '@/app/_store/store';
import { Box, Paper, Table, TableCell, TableContainer, TableRow } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import CustomTextfield from '../../_customComponents/customTextfield';
import RedirectDialog from '@/app/_util/redirectDialog';
import { messageRedirect } from '@/app/_customComponents/customProperties';

type CategoryTableProps = {
  //
};
const CategoryTable: React.FC<CategoryTableProps> = () => {
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);
  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);

  const [edit, setEdit] = useState<boolean>(false);
  const [redirectTo, setRedirectTo] = useState<boolean>(false);

  useEffect(() => {
    if (monthlyData.length === 0) {
      setRedirectTo(true);
    }
  }, [monthlyData]);

  const changeValue = () => {
    //
  };
  const handleEditFlag = () => {
    setEdit((edit) => !edit);
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '95%', margin: '1rem auto', background: grey[50] }}>
          <Box></Box>
          <TableContainer>
            <Table>
              {categoryData.map((a) => {
                return (
                  <TableRow key={a.categoryId}>
                    <TableCell>
                      <CustomNumberFormat
                        value={a.categoryId}
                        edit={false}
                        align="center"
                        onChangeValue={changeValue}
                        paramKey={'id'}
                        id={Number(a.categoryId)}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextfield
                        value={a.categoryName}
                        edit={edit}
                        onChangeValue={changeValue}
                        paramKey={'store'}
                        id={Number(a.categoryId)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <RedirectDialog
        openRedirect={redirectTo}
        closeRedirect={() => setRedirectTo(false)}
        url="/main/summaryTable"
        message={messageRedirect}
      />
    </>
  );
};

export default React.memo(CategoryTable);
