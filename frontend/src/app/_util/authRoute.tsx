// import { ReactNode } from 'react';
// import { useAuth } from './useAuth';
// import { useRouter } from 'next/navigation';

// type Props = {
//   children: ReactNode;
// };

// export const PrivateRoute = ({ children }: Props) => {
//   const authInfo = useAuth();
//   const router = useRouter();

//   // チェック中
//   if (!authInfo.checked) {
//     return <div>Loading...</div>;
//   }
//   // 認証状態の場合
//   if (authInfo.isAuthenticated) {
//     return <>{children}</>;
//   }
//   // 未認証状態
//   return <Navigate to="/signin" />;
// };

// export const GuestRoute = ({ children }: Props) => {
//   const authInfo = useAuth();
//   const router = useRouter();

//   if (!authInfo.checked) {
//     return <div>Loading...</div>;
//   }

//   if (authInfo.isAuthenticated) {
//     // 認証済みの場合
//     return <Navigate to="/" />;
//   }

//   // 未認証状態
//   return <>{children}</>;
// };
