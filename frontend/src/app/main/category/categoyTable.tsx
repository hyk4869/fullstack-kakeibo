'use client';
import { RootState } from '@/app/_store/store';
import { Box, Paper, Table, TableCell, TableContainer, TableRow, TableBody, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import CustomTextfield from '../../_customComponents/customTextfield';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import CommonTopEditButton from '@/app/_util/commonLayouts/commonTopEditButton';
import CommonTableHeader from '@/app/_util/commonLayouts/commonTableHeader';
import CreateNewRecordsDialog from '@/app/_dialog/categoryMasterTable/createNewRecordsDialog';
import { ShowCategoryMaster } from '@/app/_dialog/categoryMasterTable/showCategory';
import { sumEachCategory } from '@/app/_util/utils';
import { categoryHeaderList } from '@/app/_util/commonLayouts/headerList';
import { MCategory } from '@/app/_store/interfacesInfo';
import useWindowSize from '@/app/_util/useWindowSize';
import LoadingContent from '../../_util/commonLayouts/loading';
import Cookies from 'js-cookie';
import axios from 'axios';
import { getCategoryLink } from '@/app/_api/url';
import { setCategoryContent } from '@/app/_store/slice';
import { ExportCSVData } from '@/app/_util/CSV/exportCSVData';
import CommonTableFooter from '@/app/_util/commonFooter/commonTableFooter';

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
  const user = useSelector((state: RootState) => state.getUserInfo);
  const heightValue = useSelector((state: RootState) => state.headerHeightSlice);

  const [edit, setEdit] = useState<boolean>(false);
  const [openAddContent, setOpenAddContent] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<Array<MCategory>>([]);
  const [isShowCategoryMaster, setIsShowCategoryMaster] = useState<boolean>(false);
  const [amount, setAmount] = useState<Array<ReferenceType>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selected, setSelected] = useState<number[]>([]);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const { width, height } = useWindowSize();

  const jwtToken = Cookies.get('authToken');

  const dispatch = useDispatch();

  const formatedData = [...categoryData]
    ?.sort((a, b) => {
      if (a.sort !== null && b.sort !== null) {
        return a.sort - b.sort;
      } else {
        return 0;
      }
    })
    .map(({ id, ...data }) => {
      return {
        ...data,
      };
    });

  const csv = new ExportCSVData({ fileName: 'MCategory', file: formatedData, availableDate: true });

  useEffect(() => {
    if (width < 840) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width, height]);

  useEffect(() => {
    if (categoryData.length !== editValue.length) {
      setEditValue(categoryData);
    }
  }, [categoryData]);

  useEffect(() => {
    if (monthlyData.length !== 0 && categoryData.length !== 0) {
      setAmount(sumEachCategory(categoryData, monthlyData));
    }
  }, [monthlyData, categoryData]);

  const changeValue = useCallback(
    (id: number, paramKey: string, value: unknown) => {
      setEditValue((prevArray) => {
        return prevArray.map((d) => {
          if (d.sort === id) {
            const updateValue = { ...d };
            switch (paramKey) {
              case 'sort':
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
    [editValue],
  );

  const handleEditFlag = () => {
    setEdit((edit) => !edit);
  };

  const saveValue = async () => {
    setIsLoading(true);
    const postData = editValue.map((data) => ({
      ...data,
      userId: user.userID,
    }));
    await axios
      .post(getCategoryLink, postData, { headers: { Authorization: `Bearer ${jwtToken}` } })
      .then((res) => {
        if (res.data) {
          dispatch(setCategoryContent(res.data));
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
        setEdit(false);
      });
  };

  const deleteArrayValue = () => {};
  return (
    <>
      <Box sx={{ width: '100%', position: 'relative', top: `calc(${heightValue}px * (1 + 0.1))` }}>
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
              dataLength={editValue.length}
              deleteArrayValue={() => deleteArrayValue()}
            />
          </Box>
          <TableContainer sx={{ height: `calc(100vh * (1 - 0.35) - ${heightValue}px)` }}>
            <Table>
              <CommonTableHeader categoryHeaderList={categoryHeaderList} />
              <TableBody>
                {editValue.map((a) => {
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

          <CommonTableFooter createCSVFile={() => csv.createCSVFile()} arrayLength={categoryData.length} />
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
      <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
    </>
  );
};

export default React.memo(CategoryTable);
