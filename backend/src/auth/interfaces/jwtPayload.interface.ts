export interface JwtPayload {
  email: string;
  /**認証情報を識別するための識別子 */
  sub: number;
}
