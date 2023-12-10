'use client';

import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { EnhancedTableToolbarProps } from '../summaryTable/summaryTable';
import { TSalaryTax } from '@/app/_store/interfacesInfo';
import { alpha } from '@mui/material/styles';
import CommonTDataTableHeader from '@/app/_util/commonTDataTableHeader';
import { Order } from '@/app/_util/utilFunctions';
import { monthlyTaxHeaderList } from '@/app/_util/headerList';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/_store/store';
import { grey } from '@mui/material/colors';
import CommonEditButton from '@/app/_util/commonEditButton';
import LoadingContent from '../../_util/loading';
import useWindowSize from '@/app/_util/useWindowSize';

export interface HeadCell {
  id: keyof TSalaryTax;
  disablePadding: boolean;
  label: string;
}

/** 上のeditボタン */
const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = (props) => {
  const {
    numSelected,
    edit,
    dataLength,
    handleEditFlag,
    saveValue,
    deleteArrayValue,
    enableEdit,
    isLoading,
    setIsLoading,
    windowSize,
  } = props;

  const [openAddRecordsDialog, setOpenAddRecordsDialog] = useState<boolean>(false);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
        display: 'block',
      }}
    >
      <CommonEditButton
        edit={edit}
        handleEditFlag={handleEditFlag}
        title={'給与に対する税金関係'}
        setOpenAddContent={() => setOpenAddRecordsDialog(!openAddRecordsDialog)}
        saveValue={saveValue}
        numSelected={numSelected}
        windowSize={windowSize}
        dataLength={dataLength}
        deleteArrayValue={() => deleteArrayValue()}
        enableEdit={enableEdit}
      />
      {/* <CreateNewRecordsDialog
        openDialog={openAddRecordsDialog}
        onCloseAddRecords={() => setOpenAddRecordsDialog(false)}
        edit={edit}
      /> */}
      <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
    </Toolbar>
  );
};

type SalaryTaxProps = {
  //
};

const SalaryTaxTable: React.FC<SalaryTaxProps> = () => {
  const SalaryTaxData = useSelector((state: RootState) => state.getSalaryTax);
  const enableEdit = useSelector((state: RootState) => state.enableEdit);
  const { width, height } = useWindowSize();

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TSalaryTax>('id');
  const [selected, setSelected] = useState<number[]>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<Array<TSalaryTax>>([]);
  const [deleteSomething, setDeleteSomething] = useState<Array<TSalaryTax>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<boolean>(false);

  useEffect(() => {
    if (width < 840) {
      setWindowSize(true);
    } else {
      setWindowSize(false);
    }
  }, [width, height]);

  /**
   * 全選択のクリック関数
   * @param event boolean event
   * @returns
   */
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected([]);
    if (event.target.checked) {
      setSelected((setNum) => {
        if (SalaryTaxData) {
          const filteredData: number[] = SalaryTaxData.filter((d) => d.id !== null).map((d) => d.id as number);
          return [...setNum, ...filteredData];
        }
        return setNum;
      });
      return;
    }
    setSelected([]);
  };

  const handleEditFlag = () => {
    setEdit((edit) => !edit);
  };

  const saveValue = async () => {};

  /**
   * 一括削除
   */
  const deleteArrayValue = () => {
    setEditValue((prevValue) => {
      const updatedData = prevValue.filter((a) => !selected.includes(Number(a.id)));
      const deleteContent = prevValue.filter((a) => selected.includes(Number(a.id)));
      setDeleteSomething((prev) => {
        const uniqueDeleteContent = deleteContent.filter(
          (item) => !prev.some((existingItem) => existingItem.id === item.id),
        );
        return [...prev, ...uniqueDeleteContent];
      });
      return updatedData;
    });
    setSelected([]);
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '95%', margin: '1rem auto', background: grey[50] }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            edit={edit}
            dataLength={SalaryTaxData.length}
            handleEditFlag={handleEditFlag}
            saveValue={saveValue}
            deleteArrayValue={deleteArrayValue}
            enableEdit={enableEdit}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            windowSize={windowSize}
          />
          <TableContainer>
            <Table>
              <CommonTDataTableHeader<TSalaryTax>
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                rowCount={SalaryTaxData.length}
                setOrder={setOrder}
                setOrderBy={setOrderBy}
                labelList={monthlyTaxHeaderList}
              />
              <TableBody></TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
};

export default React.memo(SalaryTaxTable);
