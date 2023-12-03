'use client';
import {
  Box,
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import CustomTextfield from '../../_customComponents/customTextfield';
import CustomNumberFormat from '../../_customComponents/customNumeric';
import CommonTableHeader, { commonTableHeaderType } from '@/app/_util/commonTableHeader';
import { referenceType } from '@/app/main/category/categoyTable';

type ShowCategoryMasterPrpos = {
  isShowCategoryMaster: boolean;
  onCloseCategoryMaster: () => void;
  amount: referenceType[];
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
  const { isShowCategoryMaster, onCloseCategoryMaster, amount } = props;

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
                <CommonTableHeader categoryHeaderList={categoryHeaderList} />
                <TableBody>
                  {amount.map((content) => {
                    return (
                      <TableRow key={content.categoryId}>
                        <TableCell align="center">
                          <CustomNumberFormat
                            value={content?.categoryId}
                            onChangeValue={changeValue}
                            paramKey={'categoryId'}
                            id={Number(content?.categoryId)}
                            edit={false}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <CustomTextfield
                            value={content?.categoryName}
                            onChangeValue={changeValue}
                            paramKey={'categoryName'}
                            id={Number(content?.categoryId)}
                            edit={false}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <CustomNumberFormat
                            value={content?.totalCategoryName}
                            onChangeValue={changeValue}
                            paramKey={'totalCategoryName'}
                            id={Number(content?.categoryId)}
                            edit={false}
                            suffix="件"
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
