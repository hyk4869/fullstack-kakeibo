'use client';

import { RootState } from '@/app/_store/store';
import CommonTableHeader from '@/app/_util/commonLayouts/commonTableHeader';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingContent from '../../_util/commonLayouts/loading';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import { grey } from '@mui/material/colors';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import CustomTextfield from '../../_customComponents/customTextfield';
import CommonTopEditButton from '@/app/_util/commonLayouts/commonTopEditButton';
import CreateNewRecordsDialog from '@/app/_dialog/workExperienceMasterTable/createNewRecordsDialog';

import { workExperienceHeaderList } from '@/app/_util/commonLayouts/headerList';
import { MCompany } from '@/app/_store/interfacesInfo';
import useWindowSize from '@/app/_util/useWindowSize';
import axios from 'axios';
import { getCompany } from '@/app/_api/url';
import Cookies from 'js-cookie';
import { setCompanyContent } from '@/app/_store/slice';
import { ExportCSVData } from '@/app/_util/CSV/exportCSVData';
import CommonTableFooter from '@/app/_util/commonFooter/commonTableFooter';

type WorkExperienceTableProps = {
  //
};

const WorkExperienceTable: React.FC<WorkExperienceTableProps> = () => {
  const companyData = useSelector((state: RootState) => state.getCompanyContent);
  const hireDateData = useSelector((state: RootState) => state.getHireDate);
  const user = useSelector((state: RootState) => state.getUserInfo);
  const heightValue = useSelector((state: RootState) => state.headerHeightSlice);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [openAddContent, setOpenAddContent] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<Array<MCompany>>([]);

  const [selected, setSelected] = useState<number[]>([]);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const { width, height } = useWindowSize();
  const jwtToken = Cookies.get('authToken');
  const dispatch = useDispatch();

  const formatedData = [...companyData]
    ?.sort((a, b) => {
      if (a.sort !== null && b.sort !== null) {
        return a.sort - b.sort;
      } else {
        return 0;
      }
    })
    .map(({ id, ...data }) => {
      return { ...data };
    });

  const csv = new ExportCSVData({ fileName: 'MCompany', file: formatedData, availableDate: true });

  useEffect(() => {
    if (width < 840) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width, height]);

  useEffect(() => {
    if (companyData.length !== editValue.length) {
      setEditValue(companyData);
    }
  }, [companyData]);

  const changeValue = useCallback(
    (id: number, paramKey: string, value: unknown) => {
      setEditValue((prevValue) => {
        return prevValue.map((a) => {
          if (a.sort === id) {
            const updatedRow = { ...a };
            switch (paramKey) {
              case 'sort':
                updatedRow.sort = value === '' ? null : (value as number);
                break;
              case 'name':
                updatedRow.name = value === '' ? null : (value as string);
                break;
              case 'majorSector':
                updatedRow.majorSector = value === '' ? null : (value as string);
                break;
              case 'companyNum':
                updatedRow.companyNum = value === '' ? null : (value as number);
                break;
            }
            return updatedRow;
          } else {
            return a;
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
      .post(getCompany, postData, { headers: { Authorization: `Bearer ${jwtToken}` } })
      .then((res) => {
        if (res.data) {
          dispatch(setCompanyContent(res.data));
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
        <Paper sx={{ width: '95%', margin: '0.5rem auto', background: grey[50] }}>
          <Box>
            <CommonTopEditButton
              edit={edit}
              handleEditFlag={handleEditFlag}
              title={'職歴マスタの編集'}
              setOpenAddContent={() => setOpenAddContent(!openAddContent)}
              saveValue={saveValue}
              numSelected={selected.length}
              windowSize={windowSize}
              dataLength={companyData.length}
              deleteArrayValue={() => deleteArrayValue()}
            />
          </Box>
          <TableContainer sx={{ height: `calc(100vh * (1 - 0.26) - ${heightValue}px)` }}>
            <Table>
              <CommonTableHeader categoryHeaderList={workExperienceHeaderList} />
              <TableBody>
                {editValue.map((a) => {
                  return (
                    <TableRow key={a.id} sx={{ padding: commonPadding5 }}>
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
                        <CustomNumberFormat
                          value={a.companyNum}
                          edit={edit}
                          align="center"
                          onChangeValue={changeValue}
                          paramKey={'companyNum'}
                          id={Number(a.sort)}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomTextfield
                          value={a.name}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'name'}
                          id={Number(a.sort)}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomTextfield
                          value={a.majorSector}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'majorSector'}
                          id={Number(a.sort)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <CommonTableFooter createCSVFile={() => csv.createCSVFile()} arrayLength={companyData.length} />
        </Paper>
      </Box>
      <CreateNewRecordsDialog
        openDialog={openAddContent}
        onCloseAddRecords={() => setOpenAddContent(false)}
        edit={edit}
      />
      <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
    </>
  );
};

export default React.memo(WorkExperienceTable);
