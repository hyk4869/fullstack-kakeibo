'use client';
import { RootState } from '@/app/_store/store';
import { Box, Paper, Table, TableCell, TableContainer, TableRow, TableBody, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import CustomTextfield from '../../_customComponents/customTextfield';
import RedirectDialog from '@/app/_util/commonLayouts/redirectDialog';
import { messageRedirect, commonPadding5 } from '@/app/_customComponents/customProperties';
import CommonTopEditButton from '@/app/_util/commonLayouts/commonTopEditButton';
import CommonTableHeader from '@/app/_util/commonLayouts/commonTableHeader';
import CreateNewRecordsDialog from '@/app/_dialog/categoryMasterTable/createNewRecordsDialog';
import { ShowCategoryMaster } from '@/app/_dialog/categoryMasterTable/showCategory';
import { sumEachCategory } from '@/app/_util/utils';
import { categoryHeaderList } from '@/app/_util/commonLayouts/headerList';
import { MCategory } from '@/app/_store/interfacesInfo';
import useWindowSize from '@/app/_util/useWindowSize';

type CategoryTableProps = {
  //
};

export type ReferenceType = {
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
  const [amount, setAmount] = useState<Array<ReferenceType>>([]);

  const [selected, setSelected] = useState<number[]>([]);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (width < 840) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width, height]);

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
      setAmount(sumEachCategory(categoryData, monthlyData));
    }
  }, [monthlyData, categoryData]);

  const changeValue = useCallback(
    (id: number, paramKey: string, value: unknown) => {
      setEditCategoryValue((prevArray) => {
        return prevArray.map((d) => {
          if (d.sort === id) {
            const updateValue = { ...d };
            switch (paramKey) {
              case 'categoryId':
                updateValue.sort = value === '' ? null : (value as number);
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

  const deleteArrayValue = () => {};
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '95%', margin: '1rem auto', background: grey[50] }}>
          <Box>
            <CommonTopEditButton
              edit={edit}
              handleEditFlag={handleEditFlag}
              title={'カテゴリーマスタの編集'}
              setOpenAddContent={() => setOpenAddContent(!openAddContent)}
              saveValue={saveValue}
              numSelected={selected.length}
              windowSize={windowSize}
              dataLength={editCategoryValue.length}
              deleteArrayValue={() => deleteArrayValue()}
            />
          </Box>
          <TableContainer>
            <Table>
              <CommonTableHeader categoryHeaderList={categoryHeaderList} />
              <TableBody>
                {editCategoryValue.map((a) => {
                  return (
                    <TableRow key={a.sort} sx={{ padding: commonPadding5 }}>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.sort}
                          edit={false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'sort'}
                          id={Number(a.sort)}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomTextfield
                          value={a.categoryName}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'categoryName'}
                          id={Number(a.sort)}
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
