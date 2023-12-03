'use client';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../_store/store';
import CustomTextfield from '../../_customComponents/customTextfield';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import CommonTableHeader, { commonTableHeaderType } from '@/app/_util/commonTableHeader';
import { amoutType } from '@/app/main/monthlyAggregation/aggregationByCategory';

type ShowCategoryMasterPrpos = {
  isShowCategoryMaster: boolean;
  onCloseCategoryMaster: () => void;
};

const categoryHeaderList: commonTableHeaderType[] = [
  {
    label: 'id',
    id: 'categoryId',
  },
  {
    label: 'カテゴリー名',
    id: 'categoryName',
  },
  {
    label: '参照されている数',
    id: 'amount',
  },
];

export const ShowCategoryMaster: React.FC<ShowCategoryMasterPrpos> = (props) => {
  const { isShowCategoryMaster, onCloseCategoryMaster } = props;
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);
  const monthlyData = useSelector((state: RootState) => state.getMonthlySpendingContent);
  const [amount, setAmount] = useState<Array<amoutType>>([]);

  const changeValue = () => {
    //
  };
  return (
    <>
      <Dialog open={isShowCategoryMaster} onClose={onCloseCategoryMaster}>
        <DialogContent sx={{ padding: '1.5rem' }}>
          <Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <CommonTableHeader categoryHeaderList={categoryHeaderList} />
                </TableHead>
                <TableBody>
                  {categoryData.map((content) => {
                    return (
                      <TableRow key={content.categoryId}>
                        <TableCell>
                          <CustomNumberFormat
                            value={content?.categoryId}
                            onChangeValue={changeValue}
                            paramKey={'store'}
                            id={Number(content?.categoryId)}
                            edit={false}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextfield
                            value={content?.categoryName}
                            onChangeValue={changeValue}
                            paramKey={'store'}
                            id={Number(content?.categoryId)}
                            edit={false}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
