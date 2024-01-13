import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import LoadingContent from '../_util/commonLayouts/loading';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { verifyTokenLink } from '../_api/url';
import { setCategoryContent, setCompanyContent, setHireDateContent, setUserInfo } from '../_store/slice';
import { RootState } from '../_store/store';

type Props = {
  children: ReactNode;
};

const token = Cookies.get('authToken');

export const PrivateRoute = ({ children }: Props) => {
  const authInfo = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const userData = useSelector((state: RootState) => state.getUserInfo);
  const dispatch = useDispatch();

  const fetchUserData = async (): Promise<void> => {
    await axios
      .post(verifyTokenLink, { authToken: token })
      .then((res) => {
        if (res.data) {
          dispatch(setUserInfo(res.data?.user));
          const masterData = res.data?.masterData;
          dispatch(setCategoryContent(masterData.categoryData));
          dispatch(setCompanyContent(masterData.companyData));
          dispatch(setHireDateContent(masterData.hireData));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // チェック中
      if (!authInfo.checked) {
        return;
      }

      // 認証状態の場合
      if (authInfo.isAuthenticated) {
        userData.userID === '' ? await fetchUserData() : undefined;
        setIsLoading(false);
      } else {
        // 未認証状態
        await router.push('/signIn');
      }
    };

    checkAuthAndRedirect();
  }, [authInfo.checked, authInfo.isAuthenticated, router]);

  // return isLoading ? <div>Loading...</div> : <>{children}</>;
  return isLoading ? (
    <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
  ) : (
    <>{children}</>
  );
};

export const GuestRoute = ({ children }: Props) => {
  const authInfo = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // チェック中
      if (!authInfo.checked) {
        return;
      }

      // 認証済みの場合
      if (authInfo.isAuthenticated) {
        setIsLoading(false);
        await router.push('/main/summaryTable');
      } else {
        setIsLoading(false);
      }
    };

    checkAuthAndRedirect();
  }, [authInfo.checked, authInfo.isAuthenticated, router]);

  // return isLoading ? <div>Loading...</div> : <>{children}</>;
  return isLoading ? (
    <LoadingContent isLoading={isLoading} closeLoading={() => setIsLoading(false)} />
  ) : (
    <>{children}</>
  );
};
