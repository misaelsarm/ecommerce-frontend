import { DiscountModal } from '@/components/admin/discounts/DiscountModal';
import Layout from '@/components/admin/Layout'
import { Card, CardItem, Chip, Page } from '@/components/common';
import { usePermissions } from '@/hooks/usePermissions';
import { DiscountInterface } from '@/interfaces';
import { discountTypesMap } from '@/utils/mappings';
import { createServerSideFetcher } from '@/utils/serverSideFetcher';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import React, { ReactElement, useState } from 'react'

interface Props {
  discount: DiscountInterface,
  error?: {
    error: number,
    message: string
  }
}

const DiscountDetailsPage = ({ discount, error }: Props) => {

  const [editing, setEditing] = useState(false)

  const { canEdit } = usePermissions();

  if (error) {
    return <Page>{error.message}</Page>
  }

  return (
    <>
      <Page
        title={`Descuento: ${discount.name}`}
        primaryAction={{
          name: 'Editar',
          onClick: () => {
            setEditing(true)
          },
          visible: canEdit
        }}
        fullWidth={false}
        maxwidth='700px'
        backAction
      >
        <Card>
          <CardItem
            title='Nombre'
            content={<span>{discount.name}</span>}
          />
          <CardItem
            title='Tipo'
            content={<span>{discountTypesMap[discount.type]}</span>}
          />
          <CardItem
            title='Valor del descuento'
            content={<span>{discount.type === 'percentage' ? `${discount.value}%` : `$ ${discount.value.toFixed(2)} MXN`}</span>
            }
          />
          <CardItem
            title='Fecha de expiración'
            content={<span>{moment(discount.endDate).format('ll')}</span>
            }
          />
          <CardItem
            title='Fecha de expiración'
            content={<span>{moment(discount.endDate).format('ll')}</span>
            }
          />
          <CardItem
            title='Estado'
            content={discount.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
            }
          />
          {
            discount.limited &&
            <CardItem
              title='Elegibilidad'
              content={
                <>
                  <span>Este descuento solo aplica para los siguientes productos: </span>
                  <br />
                  {
                    discount.applicableProducts?.map(product => (
                      <span key={product.name}>{product.name}</span>
                    ))
                  }
                </>
              }
            />
          }
        </Card>
      </Page >
      <DiscountModal
        title='Editar descuento'
        visible={editing}
        setVisible={setEditing}
        discount={discount}
      />
    </>
  )
}

DiscountDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title={`Descuentos | ${page.props.discount?.name}`}>
      {page}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {

  return createServerSideFetcher(context, {
    endpoint: '/api/admin/discounts/:id',
    dataKey: 'discount',
    propKey: 'discount'
  })
}

export default DiscountDetailsPage