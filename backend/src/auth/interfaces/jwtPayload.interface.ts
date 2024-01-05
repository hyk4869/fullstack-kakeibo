export interface JwtPayload {
  username: string;
  /**認証情報を識別するための識別子 */
  // sub: number;
  iat?: number;
  exp?: number;
}
