'use client';

import { getCompany, getHireDate } from '@/app/_api/url';
import { commonPadding5 } from '@/app/_customComponents/customProperties';
import { setCompanyContent, setHireDateContent } from '@/app/_store/slice';
import { RootState } from '@/app/_store/store';
import CommonEditButton from '@/app/_util/commonEditButton';
import CommonTableHeader from '@/app/_util/commonTableHeader';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingContent from '../../_util/loading';
import CustomNumberFormat from '@/app/_customComponents/customNumeric';
import CustomDate from '@/app/_customComponents/customDate';
import dayjs from 'dayjs';
import CreateNewRecordsDialog from '@/app/_dialog/hireDateMasterTable/createNewRecordsDialog';
import { hireDateHeaderList } from '@/app/_util/headerList';
import { MHireDate } from '@/app/_store/interfacesInfo';

type HireDateTableProps = {
  //
};

const HireDateTable: React.FC<HireDateTableProps> = () => {
  const companyData = useSelector((state: RootState) => state.getCompanyContent);
  const hireDateData = useSelector((state: RootState) => state.getHireDate);
  const [edit, setEdit] = useState<boolean>(false);
  const [openAddContent, setOpenAddContent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editHireDateValue, setEditHireDateValue] = useState<Array<MHireDate>>([]);

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
    if (companyData.length !== editHireDateValue.length) {
      setEditHireDateValue(hireDateData);
    }
  }, [hireDateData]);

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
              title={'入退社マスタの編集'}
              setOpenAddContent={() => setOpenAddContent(!openAddContent)}
              saveValue={saveValue}
            />
          </Box>
          <TableContainer>
            <Table>
              <CommonTableHeader categoryHeaderList={hireDateHeaderList} />
              <TableBody>
                {editHireDateValue.map((a) => {
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

                      <Tooltip title={companyData.find((d) => d.id === a.companyId)?.name} arrow>
                        <TableCell align="center" sx={{ padding: commonPadding5 }}>
                          <CustomNumberFormat
                            value={a.companyId}
                            edit={false}
                            align="center"
                            onChangeValue={changeValue}
                            paramKey={'companyId'}
                            id={Number(a.id)}
                          />
                        </TableCell>
                      </Tooltip>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomDate
                          value={dayjs(a.hireDate)}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'hireDate'}
                          id={Number(a.id)}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomDate
                          value={dayjs(a.retirementDate)}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'retirementDate'}
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

export default React.memo(HireDateTable);
