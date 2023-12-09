'use client';

import { Box, Checkbox, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { EnhancedTableProps } from '../summaryTable/summaryTable';

// export interface HeadCell {
//     id: keyof ;
//     disablePadding: boolean;
//     label: string;
//   }

// /**
//  *
//  * ヘッダー
//  *
//  */
// const EnhancedTableHead: React.FC<EnhancedTableProps> = (props) => {
//   const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, windowSize } = props;
//   const createSortHandler = (property: keyof TMonthlySpending) => (event: React.MouseEvent<unknown>) => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow>
//         <TableCell padding="checkbox">
//           <Checkbox
//             color="primary"
//             indeterminate={numSelected > 0 && numSelected < rowCount}
//             checked={rowCount > 0 && numSelected === rowCount}
//             onChange={onSelectAllClick}
//             inputProps={{
//               'aria-label': 'select all desserts',
//             }}
//           />
//         </TableCell>
//         {monthlySpendingHeaderList.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             align={'center'}
//             padding={headCell.disablePadding ? 'none' : 'normal'}
//             sortDirection={orderBy === headCell.id ? order : false}
//           >
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : 'asc'}
//               onClick={createSortHandler(headCell.id)}
//             >
//               {headCell.label}
//               {orderBy === headCell.id ? (
//                 <Box component="span" sx={visuallyHidden}>
//                   {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                 </Box>
//               ) : null}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// };

// /**
//  *
//  * 上のソート
//  *
//  */
// const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = (props) => {
//   const {
//     numSelected,
//     edit,
//     dataLength,
//     handleEditFlag,
//     saveValue,
//     deleteArrayValue,
//     enableEdit,
//     isLoading,
//     setIsLoading,
//     windowSize,
//   } = props;

//   const [openAddRecordsDialog, setOpenAddRecordsDialog] = useState<boolean>(false);

//   return (
//     <Toolbar
//       sx={{
//         pl: { sm: 2 },
//         pr: { xs: 1, sm: 1 },
//         ...(numSelected > 0 && {
//           bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
//         }),
//         display: 'block',
//       }}
//     >
//       {numSelected > 0 ? (
//         <Box sx={{ padding: '10px', minWidth: '250px', flex: '1 1 100%' }} color="inherit">
//           {numSelected} レコードが選択されました。
//         </Box>
//       ) : (
//         <Box sx={{ display: windowSize ? 'block' : 'flex', justifyContent: 'space-between' }}>
//           <Box sx={{ padding: '1rem', minWidth: '250px', fontSize: '1.3rem' }}>クレジットカード明細</Box>
//           <Box sx={{ padding: '1rem', minWidth: '190px', fontSize: '0.8rem' }}>レコード数：{dataLength}件</Box>
//         </Box>
//       )}
//       <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '1rem' }}>
//         <Button
//           variant="contained"
//           color={edit ? 'error' : 'primary'}
//           disabled={!enableEdit}
//           sx={{ cursor: 'pointer' }}
//           onClick={handleEditFlag}
//         >
//           <Tooltip title={edit ? '保存するには「保存を押してください」' : undefined} arrow>
//             <span>{edit ? 'キャンセル' : '編集'}</span>
//           </Tooltip>
//         </Button>
//         <Button
//           variant="contained"
//           disabled={edit === false}
//           sx={{ cursor: 'pointer' }}
//           onClick={() => setOpenAddRecordsDialog(!openAddRecordsDialog)}
//           color="primary"
//         >
//           追加
//         </Button>
//         <Button variant="outlined" disabled={edit === false} sx={{ cursor: 'pointer' }} onClick={saveValue}>
//           保存
//         </Button>
//         {numSelected > 0 ? (
//           <Tooltip title="Delete">
//             <IconButton onClick={() => deleteArrayValue()}>
//               <DeleteIcon />
//             </IconButton>
//           </Tooltip>
//         ) : (
//           <Tooltip title="Filter list">
//             <IconButton>
//               <FilterListIcon />
//             </IconButton>
//           </Tooltip>
//         )}
//       </Box>
//       <CreateNewRecordsDialog
//         openDialog={openAddRecordsDialog}
//         onCloseAddRecords={() => setOpenAddRecordsDialog(false)}
//         edit={edit}
//       />
//       <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
//     </Toolbar>
//   );
// };

type SalaryTaxProps = {
  //
};

const SalaryTaxTable: React.FC<SalaryTaxProps> = () => {
  return (
    <>
      <Box></Box>
    </>
  );
};

export default React.memo(SalaryTaxTable);
