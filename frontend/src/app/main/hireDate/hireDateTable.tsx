'use client';

import { commonPadding5 } from '@/app/_customComponents/customProperties';
import { RootState } from '@/app/_store/store';
import CommonTopEditButton from '@/app/_util/commonLayouts/commonTopEditButton';
import CommonTableHeader from '@/app/_util/commonLayouts/commonTableHeader';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingContent from '../../_util/commonLayouts/loading';
import CustomNumberFormat from '@/app/_customComponents/customNumeric';
import CustomDate from '@/app/_customComponents/customDate';
import dayjs from 'dayjs';
import CreateNewRecordsDialog from '@/app/_dialog/hireDateMasterTable/createNewRecordsDialog';
import { hireDateHeaderList } from '@/app/_util/commonLayouts/headerList';
import { MHireDate } from '@/app/_store/interfacesInfo';
import useWindowSize from '@/app/_util/useWindowSize';
import axios from 'axios';
import { getHireDate } from '@/app/_api/url';
import Cookies from 'js-cookie';
import { setHireDateContent } from '@/app/_store/slice';
import { ExportCSVData } from '@/app/_util/CSV/exportCSVData';

type HireDateTableProps = {
  //
};

const HireDateTable: React.FC<HireDateTableProps> = () => {
  const companyData = useSelector((state: RootState) => state.getCompanyContent);
  const hireDateData = useSelector((state: RootState) => state.getHireDate);
  const user = useSelector((state: RootState) => state.getUserInfo);

  const [edit, setEdit] = useState<boolean>(false);
  const [openAddContent, setOpenAddContent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<Array<MHireDate>>([]);

  const [selected, setSelected] = useState<number[]>([]);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const { width, height } = useWindowSize();
  const jwtToken = Cookies.get('authToken');

  const dispatch = useDispatch();

  const formatedData = [...hireDateData]
    ?.sort((a, b) => {
      if (a.sort !== null && b.sort !== null) {
        return a.sort - b.sort;
      } else {
        return 0;
      }
    })
    .map(({ id, companyId, ...data }) => {
      return {
        ...data,
        hireDate: dayjs(data.hireDate).format('YYYY-MM-DD'),
        retirementDate: dayjs(data.retirementDate).format('YYYY-MM-DD'),
      };
    });

  const csv = new ExportCSVData({ fileName: 'MHireDate', file: formatedData, availableDate: true });

  useEffect(() => {
    if (width < 840) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width, height]);

  useEffect(() => {
    if (companyData.length !== editValue.length) {
      setEditValue(hireDateData);
    }
  }, [hireDateData]);

  const changeValue = useCallback(
    (id: number, paramKey: string, value: unknown) => {
      setEditValue((prevValue) => {
        return prevValue.map((a) => {
          if (a.sort === id) {
            const updateRow = { ...a };
            switch (paramKey) {
              case 'sort':
                updateRow.sort = value === '' ? null : (value as number);
                break;
              case 'companyNum':
                updateRow.companyNum = value === '' ? null : (value as number);
                break;
              case 'hireDate':
                updateRow.hireDate = value === '' ? null : (value as Date);
                break;
              case 'retirementDate':
                updateRow.retirementDate = value === '' ? null : (value as Date);
                break;
            }
            return updateRow;
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
      .post(getHireDate, postData, { headers: { Authorization: `Bearer ${jwtToken}` } })
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
        setEdit(false);
      });
  };

  const deleteArrayValue = () => {};

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '95%', margin: '0.5rem auto', background: grey[50] }}>
          <Box>
            <CommonTopEditButton
              edit={edit}
              handleEditFlag={handleEditFlag}
              title={'入退社マスタの編集'}
              setOpenAddContent={() => setOpenAddContent(!openAddContent)}
              saveValue={saveValue}
              numSelected={selected.length}
              windowSize={windowSize}
              dataLength={editValue.length}
              deleteArrayValue={() => deleteArrayValue()}
            />
          </Box>
          <TableContainer>
            <Table>
              <CommonTableHeader categoryHeaderList={hireDateHeaderList} />
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

                      <Tooltip title={companyData.find((d) => d.id === a.companyNum)?.name} arrow>
                        <TableCell align="center" sx={{ padding: commonPadding5 }}>
                          <CustomNumberFormat
                            value={a.companyNum}
                            edit={false}
                            align="center"
                            onChangeValue={changeValue}
                            paramKey={'companyNum'}
                            id={Number(a.sort)}
                          />
                        </TableCell>
                      </Tooltip>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomDate
                          value={dayjs(a.hireDate)}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'hireDate'}
                          id={Number(a.sort)}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ padding: commonPadding5 }}>
                        <CustomDate
                          value={dayjs(a.retirementDate)}
                          edit={edit}
                          onChangeValue={changeValue}
                          paramKey={'retirementDate'}
                          id={Number(a.sort)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem' }}>
            <Button variant="outlined" onClick={() => csv.createCSVFile()} disabled={hireDateData.length === 0}>
              CSVダウンロード
            </Button>
          </Box>
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
