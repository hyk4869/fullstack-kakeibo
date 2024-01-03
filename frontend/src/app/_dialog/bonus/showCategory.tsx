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
  TableRow,
  TableHead,
} from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../_store/store';
import CustomTextfield from '../../_customComponents/customTextfield';
import CustomNumberFormat from '../../_customComponents/customNumeric';

type ShowCategoryMasterPrpos = {
  isShowCategoryMaster: boolean;
  onCloseCategoryMaster: () => void;
};
export const ShowCategoryMaster: React.FC<ShowCategoryMasterPrpos> = (props) => {
  const { isShowCategoryMaster, onCloseCategoryMaster } = props;
  const categoryData = useSelector((state: RootState) => state.getCategoryContent);

  const changeValue = () => {
    //
  };
  return (
    <>
      <Dialog open={isShowCategoryMaster} onClose={onCloseCategoryMaster}>
        <DialogTitle>カテゴリーID</DialogTitle>
        <DialogContent>
          <Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">id</TableCell>
                    <TableCell align="center">カテゴリー名</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryData.map((content) => {
                    return (
                      <TableRow key={content.id}>
                        <TableCell align="center">
                          <CustomNumberFormat
                            value={content?.sort}
                            onChangeValue={changeValue}
                            paramKey={'store'}
                            id={Number(content?.sort)}
                            edit={false}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <CustomTextfield
                            value={content?.categoryName}
                            onChangeValue={changeValue}
                            paramKey={'categoryName'}
                            id={Number(content?.sort)}
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
