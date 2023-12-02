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
} from '@mui/material';
import { blue, grey } from '@mui/material/colors';
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
        <DialogTitle sx={{ background: blue[200] }}>カテゴリーID</DialogTitle>
        <DialogContent>
          <Box>
            <TableContainer>
              <Table>
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
