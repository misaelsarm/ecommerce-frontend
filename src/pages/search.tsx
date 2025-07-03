import { Layout } from '@/components/online-store/Layout';
import React, { ReactElement } from 'react'

const SearchPage = () => {
  return (
    <div>SearchPage</div>
  )
}

SearchPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title='Buscar productos'>
      {page}
    </Layout>
  );
};

export default SearchPage