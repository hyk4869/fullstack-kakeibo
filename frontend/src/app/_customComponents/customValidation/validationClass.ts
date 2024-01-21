import { ClassInterfaces, ReturnValidationData } from './validationInterfaces';

export class CustomValidation implements ClassInterfaces {
  /**
   * emailの正規表現
   */
  private _emailRegex: RegExp = /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  /**
   * 半角英数字のみ許容UerID。空欄は許容しない。
   */
  private _userIDRegex: RegExp = /^[0-9a-zA-Z]+$/;

  /**
   * 許可 大小の半角英数字。特殊文字。
   * 許可しない 空欄。
   */
  private _passwordRegex: RegExp = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{6,}$/;

  /**
   * stringに変換
   * @param value 文字列
   * @returns string
   */
  private convertToString = (value: unknown): string => {
    return typeof value === 'string' ? value : value !== '' ? String(value) : '';
  };

  /**
   * メールアドレスのカスタムチェック
   * @param value メール
   * @returns ReturnValidationDataオブジェクト
   */
  public emailCheck(value: unknown): ReturnValidationData {
    const emailValue = this.convertToString(value);

    if (this._emailRegex.test(emailValue)) {
      return {
        status: true,
        comment: '有効なメールアドレスです。',
        type: 'sucess',
        value: value,
      };
    } else {
      return {
        status: false,
        comment: '無効なメールアドレスです。',
        type: 'warn',
        value: value,
      };
    }
  }

  /**
   * ユーザーIDのカスタムチェック
   * @param value ユーザー
   * @returns ReturnValidationDataオブジェクト
   */
  public userIDCheck(value: unknown): ReturnValidationData {
    const userIDValue = this.convertToString(value);

    if (this._userIDRegex.test(userIDValue)) {
      if (userIDValue.length >= 4) {
        return {
          status: true,
          comment: '正しい入力です。',
          type: 'sucess',
          value: value,
        };
      } else {
        return {
          status: false,
          comment: '4文字以上の半角英数字で入力してください。',
          type: 'warn',
          value: value,
        };
      }
    } else {
      return {
        status: false,
        comment: '無効な入力です。userIDは半角英数字のみで入力してください。',
        type: 'error',
        value: value,
      };
    }
  }

  /**
   * パスワードのカスタムチェック
   * @param value パスワード
   * @returns ReturnValidationDataオブジェクト
   */
  public passwordCheck(value: unknown): ReturnValidationData {
    const passwordValue = this.convertToString(value);

    if (this._passwordRegex.test(passwordValue)) {
      if (passwordValue.length >= 6) {
        return {
          status: true,
          comment: '正しい入力です。',
          type: 'sucess',
          value: value,
        };
      } else {
        return {
          status: false,
          comment: '6文字以上の入力にしてください。',
          type: 'warn',
          value: value,
        };
      }
    } else {
      return {
        status: false,
        comment: '不正な文字があります。',
        type: 'error',
        value: value,
      };
    }
  }

  /**
   * 確認用のパスワード
   * @param password パスワード
   * @param confirmValue 確認用のパスワード
   * @returns ReturnValidationDataオブジェクト
   */
  public passwordDuplicateCheck(password: undefined, confirmValue: unknown): ReturnValidationData {
    const passwordValue = this.convertToString(password);
    const confirmPassword = this.convertToString(confirmValue);

    if (passwordValue === confirmPassword) {
      return {
        status: true,
        comment: '正しい入力です。',
        type: 'sucess',
        value: confirmValue,
      };
    } else {
      return {
        status: false,
        comment: 'パスワードが異なります。',
        type: 'warn',
        value: confirmValue,
      };
    }
  }
}
