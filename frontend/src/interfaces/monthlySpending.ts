/**月の出費 */
export interface MonthlySpending {
  /** id番号 */
  id: number;
  /** ユーザーID */
  userId: number;
  /** 利用日 */
  paymentDay: Date;
  /** 利用店 */
  store: string;
  /** 利用金額 */
  usageFee: number;
  /** カテゴリー */
  category: {
    /**　カテゴリーID */
    categoryId: number;
    /** カテゴリー名 */
    categoryName: string;
    /** ユーザーID */
    userId: number;
  };
}
