export type Payload = {
  userId: string;
  sub: number;
  /**トークンが作成された時刻 */
  iat: number;
  /**有効期限 */
  exp: number;
};
