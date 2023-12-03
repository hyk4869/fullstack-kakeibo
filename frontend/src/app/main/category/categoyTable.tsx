'use client';
import { RootState } from '@/app/_store/store';
import { Box, Paper, Table, TableCell, TableContainer, TableRow, TableHead, TableBody, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import CustomTextfield from '../../_customComponents/customTextfield';
import RedirectDialog from '@/app/_util/redirectDialog';
import { messageRedirect, commonPadding5 } from '@/app/_customComponents/customProperties';
import CommonEditButton from '@/app/_util/commonEditButton';
import CommonTableHeader, { commonTableHeaderType } from '@/app/_util/commonTableHeader';
import { MCategory, TMonthlySpending } from '@/app/_store/slice';
import CreateNewRecordsDialog from '@/app/_dialog/categoryTable/createNewRecordsDialog';
import { ShowCategoryMaster } from '@/app/_dialog/categoryTable/showCategory';

type CategoryTableProps = {
  //
};

export const categoryHeaderList: commonTableHeaderType[] = [
  {
    label: 'id',
    id: 'categoryId',
  },
  {
    label: 'カテゴリー名',
    id: 'categoryName',
  },
];

export type referenceType = {
  totalCategoryName: number | null;
  categoryId: number | null;
  categoryName: string | null;
};

const CategoryTable: React.FC<CategoryTableProps> = () => {
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);
  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);

  const [edit, setEdit] = useState<boolean>(false);
  const [redirectTo, setRedirectTo] = useState<boolean>(false);
  const [openAddContent, setOpenAddContent] = useState<boolean>(false);
  const [editCategoryValue, setEditCategoryValue] = useState<Array<MCategory>>([]);
  const [isShowCategoryMaster, setIsShowCategoryMaster] = useState<boolean>(false);
  const [amount, setAmount] = useState<Array<referenceType>>([]);

  useLayoutEffect(() => {
    if (monthlyData.length === 0) {
      setRedirectTo(true);
    }
  }, [monthlyData]);

  useEffect(() => {
    if (categoryData.length !== editCategoryValue.length) {
      setEditCategoryValue(categoryData);
    }
  }, [categoryData]);

  useEffect(() => {
    if (monthlyData.length !== 0 && categoryData.length !== 0) {
      const calclatedAmount: Array<referenceType> = [];

      categoryData.forEach((category: MCategory) => {
        const categoryName = category.categoryName;
        const categoryId = category.categoryId;

        const findMonthlyData = monthlyData.filter(
          (monthly: TMonthlySpending) => monthly.category?.categoryName === categoryName,
        );
        const countEachCategory = findMonthlyData.length;

        calclatedAmount.push({
          categoryName: categoryName,
          categoryId: categoryId,
          totalCategoryName: countEachCategory,
        });
      });

      setAmount(calclatedAmount);
    }
  }, [monthlyData, categoryData]);

  const changeValue = useCallback(
    (id: number, paramKey: string, value: unknown) => {
      setEditCategoryValue((prevArray) => {
        return prevArray.map((d) => {
          if (d.categoryId === id) {
            const updateValue = { ...d };
            switch (paramKey) {
              case 'categoryId':
                updateValue.categoryId = value === '' ? null : (value as number);
                break;
              case 'categoryName':
                updateValue.categoryName = value === '' ? null : (value as string);
                break;
            }
            return updateValue;
          } else {
            return d;
          }
        });
      });
    },
    [editCategoryValue],
  );

  const handleEditFlag = () => {
    setEdit((edit) => !edit);
  };

  const saveValue = useCallback(() => {}, [categoryData, monthlyData]);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '95%', margin: '1rem auto', background: grey[50] }}>
          <Box>
            <CommonEditButton
              edit={edit}
              handleEditFlag={handleEditFlag}
              title={'カテゴリーマスタの編集'}
              setOpenAddContent={() => setOpenAddContent(!openAddContent)}
              saveValue={saveValue}
            />
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <CommonTableHeader categoryHeaderList={categoryHeaderList} />
              </TableHead>
              <TableBody>
                {editCategoryValue.map((a) => {
                  return (
                    <TableRow key={a.categoryId} sx={{ padding: commonPadding5 }}>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.categoryId}
                          edit={false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'categoryId'}
                          id={Number(a.categoryId)}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomTextfield
                          value={a.categoryName}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'categoryName'}
                          id={Number(a.categoryId)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            margin: '1rem auto',
            width: '95%',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Button onClick={() => setIsShowCategoryMaster(true)} variant="outlined">
            参照されている数を表示
          </Button>
        </Box>
      </Box>
      <RedirectDialog
        openRedirect={redirectTo}
        closeRedirect={() => setRedirectTo(false)}
        url="/main/summaryTable"
        message={messageRedirect}
      />
      <CreateNewRecordsDialog
        openDialog={openAddContent}
        onCloseAddRecords={() => setOpenAddContent(false)}
        edit={edit}
      />
      <ShowCategoryMaster
        isShowCategoryMaster={isShowCategoryMaster}
        onCloseCategoryMaster={() => setIsShowCategoryMaster(false)}
        amount={amount}
      />
    </>
  );
};

export default React.memo(CategoryTable);
