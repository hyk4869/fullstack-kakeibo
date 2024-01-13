'use client';

import { commonPadding5 } from '@/app/_customComponents/customProperties';
import { RootState } from '@/app/_store/store';
import CommonTopEditButton from '@/app/_util/commonLayouts/commonTopEditButton';
import CommonTableHeader from '@/app/_util/commonLayouts/commonTableHeader';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
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

  const [selected, setSelected] = useState<number[]>([]);
  const [windowSize, setWindowSize] = useState<boolean>(false);
  const { width, height } = useWindowSize();

  const dispatch = useDispatch();

  useEffect(() => {
    if (width < 840) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width, height]);

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
              dataLength={editHireDateValue.length}
              deleteArrayValue={() => deleteArrayValue()}
            />
          </Box>
          <TableContainer>
            <Table>
              <CommonTableHeader categoryHeaderList={hireDateHeaderList} />
              <TableBody>
                {editHireDateValue.map((a) => {
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
