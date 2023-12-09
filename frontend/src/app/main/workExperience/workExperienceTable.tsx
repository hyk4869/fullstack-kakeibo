'use client';

import { getCompany, getHireDate } from '@/app/_api/url';
import { setCompanyContent, setHireDateContent } from '@/app/_store/slice';
import { RootState } from '@/app/_store/store';
import CommonTableHeader from '@/app/_util/commonTableHeader';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingContent from '../../_util/loading';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import { grey } from '@mui/material/colors';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import CustomTextfield from '../../_customComponents/customTextfield';
import CommonEditButton from '@/app/_util/commonEditButton';
import CreateNewRecordsDialog from '@/app/_dialog/workExperienceMasterTable/createNewRecordsDialog';
import { ShowWorkExperienceMaster } from '@/app/_dialog/workExperienceMasterTable/showWorkExperience';
import { ReferenceType } from '../category/categoyTable';
import { sumEachCategory } from '@/app/_util/utilFunctions';
import { workExperienceHeaderList } from '@/app/_util/headerList';
import { MCompany } from '@/app/_store/interfacesInfo';

type WorkExperienceTableProps = {
  //
};

const WorkExperienceTable: React.FC<WorkExperienceTableProps> = () => {
  const companyData = useSelector((state: RootState) => state.getCompanyContent);
  const hireDateData = useSelector((state: RootState) => state.getHireDate);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [openAddContent, setOpenAddContent] = useState<boolean>(false);
  const [editCompanyValue, setEditCompanyValue] = useState<Array<MCompany>>([]);
  const [isShowCategoryMaster, setIsShowCategoryMaster] = useState<boolean>(false);
  // const [amount, setAmount] = useState<Array<ReferenceType>>([]);

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

  useEffect(() => {
    if (companyData.length !== editCompanyValue.length) {
      setEditCompanyValue(companyData);
    }
  }, [companyData]);

  // useEffect(() => {
  //   if (companyData.length !== 0) {
  //     setAmount(sumEachCategory(categoryData, monthlyData));
  //   }
  // }, [companyData]);

  const changeValue = useCallback(() => {
    //
  }, []);

  const handleEditFlag = () => {
    setEdit((edit) => !edit);
  };

  const saveValue = useCallback(() => {}, []);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '95%', margin: '0.5rem auto', background: grey[50] }}>
          <Box>
            <CommonEditButton
              edit={edit}
              handleEditFlag={handleEditFlag}
              title={'職歴マスタの編集'}
              setOpenAddContent={() => setOpenAddContent(!openAddContent)}
              saveValue={saveValue}
            />
          </Box>
          <TableContainer>
            <Table>
              <CommonTableHeader categoryHeaderList={workExperienceHeaderList} />
              <TableBody>
                {editCompanyValue.map((a) => {
                  return (
                    <TableRow key={a.id} sx={{ padding: commonPadding5 }}>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomNumberFormat
                          value={a.id}
                          edit={false}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'id'}
                          id={Number(a.id)}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomTextfield
                          value={a.name}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'name'}
                          id={Number(a.id)}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomTextfield
                          value={a.majorSector}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'majorSector'}
                          id={Number(a.id)}
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
      <CreateNewRecordsDialog
        openDialog={openAddContent}
        onCloseAddRecords={() => setOpenAddContent(false)}
        edit={edit}
      />
      {/* <ShowWorkExperienceMaster
        isShowCategoryMaster={isShowCategoryMaster}
        onCloseCategoryMaster={() => setIsShowCategoryMaster(false)}
        amount={amount}
      /> */}
      <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
    </>
  );
};

export default React.memo(WorkExperienceTable);
