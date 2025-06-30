import Table from '@/components/admin/Table';
import DatePicker from '@/components/common/DatePicker';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import Select from '@/components/common/Select';
import Empty from '@/components/Empty';
import AccountLayout from '@/components/online-store/AccountLayout';
import { Layout } from '@/components/online-store/Layout';
import { ReminderInterface } from '@/interfaces/Reminder';
import { getServerSideToken } from '@/utils/getServerSideToken';
import { makeRequest } from '@/utils/makeRequest';
import { occasionTypesMap } from '@/utils/mappings';
import { messageTypes } from '@/utils/messages';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
  reminders: ReminderInterface[]
}

const AccountRemindersPage = ({ reminders }: Props) => {

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => moment(text).format('ll')
    },
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Ocasión',
      dataIndex: 'ocasion',
      key: 'ocasion',
      //@ts-ignore
      render: (text: string) => occasionTypesMap[text]
    },
    {
      title: 'Editar / Eliminar',
      dataIndex: 'actions',
      key: 'actions',
      render: (text: string, record: ReminderInterface) => (
        <div className='d-flex'>
          <button
            onClick={() => {
              setSelectedReminder(record)
              setVisible(true)
              reset({
                title: record.title,
                ocasion: {
                  //@ts-ignore
                  label: occasionTypesMap[record.ocasion],
                  value: record.ocasion
                },
                date: new Date(`${record.date}T00:00:00`)
              })
            }}
            className='btn btn-primary mr-20'>Editar</button>
          <button
            onClick={() => {
              setConfirmDelete(true)
              setSelectedReminder(record)
            }}
            className='btn'>Eliminar</button>
        </div>
      )

    },
  ]

  const [visible, setVisible] = useState(false)

  const { replace } = useRouter()

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  const [selectedReminder, setSelectedReminder] = useState<ReminderInterface | null>(null)

  const [loading, setLoading] = useState(false)

  const [confirmDelete, setConfirmDelete] = useState(false)

  const resetForm = () => {
    setVisible(false)
    setSelectedReminder(null)
    reset({
      title: null,
      date: null,
      ocasion: null
    })
  }

  const onSubmit = async (values: any) => {

    const post = {
      title: values.title,
      ocasion: values.ocasion.value,
      date: moment(values.date).format('YYYY-MM-DD')
    }

    if (!selectedReminder) {
      try {
        await makeRequest('post', '/api/me/reminders', post)
        toast.success('Recordatorio creado')
        replace('/account/reminders')
        resetForm()

      } catch (error: any) {
        console.log({ error })
        toast.error(error.response.data.message)
      }
    } else {
      try {

        await makeRequest('put', `/api/me/reminders/${selectedReminder?._id}`, post)
        toast.success('Recordatorio actualizado')
        replace('/account/reminders')
        resetForm()

      } catch (error: any) {
        console.log({ error })
        toast.error(error.response.data.message)
      }
    }
  }

  return (
    <>
      {
        reminders.length === 0 ? <Empty title='Aún no has agregado recordatorios' icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
        </svg>
        } /> : <Table data={reminders} columns={columns} />
      }
      <br />
      <button
        onClick={() => {
          setVisible(true)
        }}
        className='btn btn-primary'>Agregar recordatorio</button>
      <Modal
        title='Nuevo recordatorio'
        visible={visible}
        onClose={() => {
          resetForm()
        }}
        onCancel={() => {
          resetForm()
        }}
        onOk={handleSubmit(onSubmit)}
      >
        <div>
          <Input
            name='title'
            register={register}
            required
            label='Título'
            errors={errors}
          />
          <Select
            required
            errors={errors}
            control={control}
            options={messageTypes}
            name="ocasion"
            label="Ocasión"
          />
          <DatePicker
            label="Fecha"
            control={control}
            required
            errors={errors}
            name="date"
          />
        </div>
      </Modal>

      <Modal
        loadingState={loading}
        title="Eliminar recordatorio"
        wrapperStyle={{
          height: 'auto',
          width: 400
        }}
        bodyStyle={{
          height: 'auto'
        }}
        visible={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onCancel={() => setConfirmDelete(false)}
        onOk={async () => {
          try {
            setLoading(true)
            await makeRequest('put', `/api/me/reminders/${selectedReminder?._id}`, { deleted: true })
            toast.success(`Se eliminó el recordatorio ${selectedReminder?.title}`)
            setConfirmDelete(false);
            setSelectedReminder(null)
            replace('/account/reminders')
            setLoading(false)
          } catch (error: any) {
            setLoading(false)
            toast.error(error.response.data.message)
          }
        }}
      >
        <div><span>¿Confirmar eliminación del recordatorio <b>{selectedReminder?.title}</b>? Esta acción no se puede deshacer.</span></div>
      </Modal>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  let reminders = []

  let errorCode = null;

  let errorMessage = null;

  let data

  const url = `/api/me/reminders`

  try {

    const token = getServerSideToken(req)

    data = await makeRequest('get', url, {}, {
      headers: {
        "x-access-token": token,
      }
    })

    reminders = data.reminders;

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
      reminders
    },
  };
}

AccountRemindersPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Recordatorios">
      <AccountLayout>{page}</AccountLayout>
    </Layout>
  );
};

export default AccountRemindersPage