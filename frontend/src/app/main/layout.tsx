'use client';
import { Provider } from 'react-redux';
import CustomMenuBar from '../layoutComponents/menuBar';
import { store } from '../_store/store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CustomMenuBar TitleName={'ようこそ'} />
      {children}
    </Provider>
  );
}
