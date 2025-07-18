import { DiscountModal } from '@/components/admin/discounts/DiscountModal'
import Layout from '@/components/admin/Layout'
import { Chip, Page, Table } from '@/components/common'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { usePermissions } from '@/hooks/usePermissions'
import { DiscountInterface } from '@/interfaces'
import { getServerSideToken } from '@/utils/getServerSideToken'
import { makeRequest } from '@/utils/makeRequest'
import { discountTypesMap } from '@/utils/mappings'
import moment from 'moment'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useState } from 'react'

interface Props {
  discounts: DiscountInterface[],
  page: number,
  limit: number,
  error: {
    error: number,
    message: string
  }
  batchSize: number,
  totalRecords: number
}

const DiscountsAdminPage = ({ discounts = [], page, limit, batchSize, totalRecords, error }: Props) => {

  const [visible, setVisible] = useState(false)

  const { push } = useRouter()

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'discounts', limit })

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (_text: string, record: DiscountInterface) => discountTypesMap[record.type]
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      render: (_text: string, record: DiscountInterface) => record.type === 'fixed' ? `$ ${record.value.toFixed(2)} MXN` : `${record.value}%`,
    },
    {
      title: 'Fecha de expiración',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text: string) => moment(text).format('ll')
    },
    {
      title: 'Estado',
      dataIndex: 'active',
      key: 'active',
      render: (_text: string, record: DiscountInterface) => <div className='d-flex flex-column align-start'>
        {
          record.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
        }
      </div>
    }
  ]

  const { canCreate } = usePermissions();

  return (
    <>
      {
        error ?
          <Page>
            {error.message}
          </Page> :
          <>
            <Page
              title='Descuentos'
              primaryAction={{
                name: "Nuevo descuento",
                onClick: () => {
                  setVisible(true)
                },
                visible: canCreate
              }}
              search={{
                handleSearch: handleSearch,
                searchTerm: searchTerm,
                onClearSearch: () => {
                  push(`/admin/discounts?page=1&limit=20`);
                  setSearchTerm('')
                }
              }}
            >
              <Table
                columns={columns}
                data={discounts}
                page={page}
                limit={limit}
                batchSize={batchSize}
                totalRecords={totalRecords}
                navigateTo='admin/discounts'
                paramKey='_id'
              />
            </Page>
            <DiscountModal
              title='Nuevo descuento'
              visible={visible}
              setVisible={setVisible}
            />
          </>
      }
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query, resolvedUrl }) => {

  const { page, limit, search = '' } = query;

  let discounts = []

  let errorCode = null;

  let errorMessage = null;

  let data

  try {

    const token = getServerSideToken(nextReq)

    data = await makeRequest('get', `/api/admin/discounts?page=${page}&limit=${limit}&search=${search}`, {}, {
      headers: {
        "x-access-token": token
      }
    })

    discounts = data.discounts

  } catch (error: any) {
    errorCode = error.response?.status
    errorMessage = error.response?.data.message
  }

  // Handle redirection or returning error code
  if (errorCode) {
    return {
      props: {
        error: {
          error: errorCode,
          message: errorMessage
        }
      },
    };
  }

  return {
    props: {
      discounts,
      page: Number(page),
      limit: Number(limit),
      batchSize: data.batchSize,
      totalRecords: data.totalRecords
    },
  };
}

DiscountsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Descuentos">
      {page}
    </Layout>
  );
};

export default DiscountsAdminPage