import { grey, red } from '@mui/material/colors';
import { TMonthlySpending } from '../_store/slice';

/**共通のフォントサイズ */
export const commonFontSize: string = '12px';
/**共通の最低幅 */
export const minWidth: string = '7.2rem';
/**白 */
export const colorWhite: string = 'white';
/**黒 */
export const colorBlack: string = 'black';
/**イニシャルバリュー */
export const newMonthlySpending: TMonthlySpending = {
  id: 1,
  userId: null,
  paymentDay: null,
  store: '',
  usageFee: null,
  categoryId: null,
};
//   const changeValue = useCallback((paramKey: string, value: unknown) => {
//     setMakeNewArray((prevArray) => {
//       return prevArray.map((row) => {
//         if (row.id === Number(paramKey)) {
//           return {
//             ...row,
//             [paramKey]: value === '' ? null : value,
//           };
//         } else {
//           return row;
//         }
//       });
//     });
//   }, []);
