'use client';

import { store } from '@/app/_store/store';
import React from 'react';
import { Provider } from 'react-redux';
import CategoryTable from './categoyTable';
import { PrivateRoute } from '@/app/_util/authRoute';

type CategoryPageProps = {
  //
};

const CategoryPage: React.FC<CategoryPageProps> = () => {
  return (
    <>
      <Provider store={store}>
        <PrivateRoute>
          <CategoryTable />
        </PrivateRoute>
      </Provider>
    </>
  );
};

export default React.memo(CategoryPage);
