import AccountLayout from '@/components/online-store/AccountLayout';
import { Layout } from '@/components/online-store/Layout';
import React, { ReactElement } from 'react'

const AccountPrivacyPage = () => {
  return (
    <div>AccountPrivacyPage</div>
  )
}

AccountPrivacyPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Pedidos">
      <AccountLayout>{page}</AccountLayout>
    </Layout>
  );
};

export default AccountPrivacyPage