export interface ReturnCommonValidationData {
  /** 状態 */
  status: boolean;
}

export interface ReturnValidationData extends ReturnCommonValidationData {
  /** コメント */
  comment: string;
  /** 危険、警告、注意、成功 、エラー */
  type: 'warn' | 'caution' | 'alert' | 'sucess' | 'error';
  /** バリデーションされている値 */
  value?: unknown;
}

export interface ClassInterfaces {
  /** メールアドレスのカスタムチェック */
  emailCheck: (value: unknown) => ReturnValidationData;
  /** ユーザーIDのカスタムチェック */
  userIDCheck: (value: unknown) => ReturnValidationData;
  /** パスワードのカスタムチェック */
  passwordCheck: (value: unknown) => ReturnValidationData;
  /** 確認用のパスワード確認 */
  passwordDuplicateCheck: (password: undefined, confirmValue: unknown) => ReturnValidationData;
}
