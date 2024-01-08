import { useEffect, useState } from 'react';
import { Payload } from './types/payload';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

type authInfoType = {
  /**認証のチェック処理が済んでいるかどうかの状態 */
  checked: boolean;
  /**認証済みかどうか */
  isAuthenticated: boolean;
};
const defaultValue = {
  checked: false,
  isAuthenticated: false,
};

/**バックエンドから受け取ったJWTが存在するか、JWTの有効期限が切れていないかチェックを行う。 */
export const useAuth = () => {
  const [authInfo, setAuthInfo] = useState<authInfoType>(defaultValue);

  //useAuthが読み込まれた際に一度だけ実行されるよう設定
  useEffect(() => {
    /**localstorageに保存 */
    // const token = localStorage.getItem('token');
    const token = Cookies.get('token');

    try {
      if (token) {
        const decodedToken = jwtDecode<Payload>(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          //   localStorage.removeItem('token');
          Cookies.remove('token');
          setAuthInfo({ checked: true, isAuthenticated: false });
        } else {
          // 認証済み
          setAuthInfo({ checked: true, isAuthenticated: true });
        }
      } else {
        setAuthInfo({ checked: true, isAuthenticated: false });
      }
    } catch (error) {
      setAuthInfo({ checked: true, isAuthenticated: false });
    }
  }, []);
  return authInfo;
};
