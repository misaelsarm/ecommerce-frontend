import Layout from '@/components/admin/Layout'
import Users from '@/components/admin/users/Users'
import React, { ReactElement } from 'react'

const users = () => {
  return (
    <Users />
  )
}

users.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Usuarios">
      {page}
    </Layout>
  );
};

export default users