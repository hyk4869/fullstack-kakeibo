import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import LoadingContent from '../_util/commonLayouts/loading';

type Props = {
  children: ReactNode;
};

export const PrivateRoute = ({ children }: Props) => {
  const authInfo = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // チェック中
      if (!authInfo.checked) {
        return;
      }

      // 認証状態の場合
      if (authInfo.isAuthenticated) {
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
