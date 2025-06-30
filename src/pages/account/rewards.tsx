import AccountLayout from '@/components/online-store/AccountLayout';
import { Layout } from '@/components/online-store/Layout';
import Image from 'next/image';
import React, { ReactElement } from 'react'
import styles from '@/styles/online-store/account/Points.module.scss'
import { makeRequest } from '@/utils/makeRequest';
import { v4 as uuidv4 } from 'uuid'
import { UserInterface } from '@/interfaces';
import toast from 'react-hot-toast';
import { GetServerSideProps } from 'next';
import { getServerSideToken } from '@/utils/getServerSideToken';
import { getServerSideUserId } from '@/utils/getServerSideUserId';
import { sumByProperty } from '@/utils/sumByProperty';

interface Props {
  user: UserInterface
}

const AccountPointsPage = ({ user }: Props) => {

  const redeemPoints = async () => {

    const prefix = uuidv4().substring(0, 5).toUpperCase()

    const discount = {
      user: user.id,
      name: prefix,
      active: true,
      value: 250,
      type: 'fixed',
      endDate: '2025-02-14'

    }

    try {
      await makeRequest('post', '/api/discounts', discount)
      toast.success('Puntos canjeados')
    } catch (error) {

    }
  }

  const points = sumByProperty(user.rewards, 'points')

  return (
    <div className={styles.points}>
      <div className={styles.header}>

        <div className={styles.image}>
          <Image src='/perrito.png' alt='perrito globero' fill />
        </div>
        <h2>Programa de recompensas</h2>
        <span>¡Por cada compra acumula puntos! Por cada peso mexicano pagado (sin contar el costo de envío) se obtiene <b>1 punto</b> con vigencia de 12 meses. Al acumular <b>3,000 puntos</b>, obtienes un cupón por <b>$250.00 pesos</b> que podrás usar en tu siguiente compra.</span>
      </div>

      <div className={styles.current}>
        <h3>Llevas acumulados</h3>
        <h1>{points} puntos</h1>
        {
          points > 3000 &&
          <button onClick={redeemPoints} className='btn btn-primary'>Reclama tu recompensa</button>
        }
        {/*  <ProgressTracker currentStep={1} /> */}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {

  let user

  const token = getServerSideToken(req)

  const userId = getServerSideUserId(req)

  try {
    const data = await makeRequest('get', `/api/users/${userId}`, {}, {
      headers:
      {
        "x-access-token": token
      }
    })
    user = data.user
  } catch (error) {

  }

  return {
    props: {

      user
    }
  }
}

AccountPointsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Pedidos">
      <AccountLayout>{page}</AccountLayout>
    </Layout>
  );
};

export default AccountPointsPage