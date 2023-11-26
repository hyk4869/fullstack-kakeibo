import { red, blue, purple, pink, green, yellow, orange, grey } from '@mui/material/colors';
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
/** 色100 */
export const color100 = [red[100], blue[100], purple[100], pink[100], green[100], yellow[100], orange[100], grey[100]];

/** 色200 */
export const color200 = [red[200], blue[200], purple[200], pink[200], green[200], yellow[200], orange[200], grey[200]];
