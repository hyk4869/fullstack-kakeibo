'use client';

import { store } from '@/app/_store/store';
import React from 'react';
import { Provider } from 'react-redux';
import CategoryTable from './categoyTable';

type CategoryPageProps = {
  //
};

const CategoryPage: React.FC<CategoryPageProps> = () => {
  return (
    <>
      <Provider store={store}>
        <CategoryTable />
      </Provider>
    </>
  );
};

export default React.memo(CategoryPage);
