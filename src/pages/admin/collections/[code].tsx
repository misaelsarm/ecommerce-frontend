import Layout from "@/components/admin/Layout"
import Card from "@/components/common/Card/Card"
import CardItem from "@/components/common/CardItem/CardItem"
import Checkbox from "@/components/common/Checkbox/Checkbox"
import Chip from "@/components/common/Chip/Chip"
import DropZone from "@/components/common/DropZone/DropZone"
import Input from "@/components/common/Input/Input"
import Modal from "@/components/common/Modal/Modal"
import Page from "@/components/common/Page/Page"
import Select from "@/components/common/Select/Select"
import TextArea from "@/components/common/TextArea/TextArea"
import { CollectionInterface } from "@/interfaces"
import { makeRequest } from "@/utils/makeRequest"
import { createServerSideFetcher } from "@/utils/serverSideFetcher"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface Props {
  collection: CollectionInterface,
  error: {
    error: number,
    message: string
  }

}

const CollectionDetailsPage = ({ collection, error }: Props) => {

  if (error) {
    return <Page>{error.message}</Page>
  }

  const [editing, setEditing] = useState(false)

  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<any>({
    defaultValues: {
      name: collection.name,
      description: collection.description,
      keywords: collection.keywords,
      parentCollection: {
        label: collection.parentCollection?.name,
        value: collection.parentCollection?._id
      },
      products: collection.products?.map(prod => ({
        label: prod?.name,
        value: prod?._id
      })),
      active: collection.active,
    }
  });

  const [collections, setCollections] = useState<any[]>([])

  async function fetchData() {
    try {

      const data = await makeRequest('get', `/api/collections?active=true`)

      setCollections(data.collections.map((col: CollectionInterface) => ({
        label: col.name,
        value: col._id
      })))
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error')
    }
  }

  const [saving, setSaving] = useState(false)

  const { replace, back, pathname } = useRouter()

  const onSubmit = async (values: any) => {

    try {
      setSaving(true)
      const update = {
        name: values.name,
        description: values.description,
        parents: values.parents?.map((item: any) => item.value),
        keywords: values.keywords,
        color: values.color,
        active: values.active,
        highlight: values.highlight,
        image: values.image,
        banner: values.banner,
      }
      await makeRequest('put', `/api/collections/${collection._id}`, update)
      toast.success('Colección actualizada')
      setSaving(false)
      setEditing(false)
      replace(`/admin/collections/${values.name.trim().toLowerCase().split(' ').join('-')}`)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al actualizar la colección. ' + error)
      setSaving(false)
    }
  }

  const renderForm = () => {
    return (
      <>
        <Input
          register={register}
          label='Nombre'
          placeholder=''
          name='name'
          errors={errors}
          required
        />
        <TextArea
          register={register}
          label='Descripción'
          placeholder=''
          name='description'
          errors={errors}
          required
        />
        <Select
          control={control}
          options={collections}
          name="parents"
          label="Colecciones agrupadoras"
          isMulti
        />
        <Input
          register={register}
          label='Palabras clave'
          placeholder=''
          name='keywords'
        />
        <Checkbox
          register={register}
          label='Destacar'
          id='highlight'
          name='highlight'
        />
        <Checkbox
          label='Activa'
          id='active'
          name='active'
          register={register}
        />
        <DropZone
          folder='collections/images'
          label='Subir imagen principal'
          name='image'
          register={register}
          setValue={setValue}
          required
          errors={errors}
          width='100%'
          height='300px'
        />
      </>
    )
  }

  return (
    <>
      <Page
        title={`Colección: ${collection.name}`}
        primaryAction={{
          name: 'Editar',
          onClick: () => {
            setEditing(true)
            fetchData()
          },
          // visible: !editing && hasPermission('collections', 'edit')
        }}
        fullWidth={false}
        maxwidth="700px"
      >
        <Card>
          <CardItem
            title="Nombre"
            content={<span>{collection.name}</span>}
          />
          <CardItem
            title="Código"
            content={<span>{collection.code}</span>}
          />
          <CardItem
            title="Descripción"
            content={<span style={{ whiteSpace: 'pre-line' }}>{collection.description}</span>}
          />
          {
            collection.parentCollection &&
            <CardItem
              title="Colección agrupadora"
              content={<Chip text={collection.parentCollection?.name} />}
            />
          }
          <CardItem
            title="Palabras clave"
            content={<span>{collection.keywords}</span>}
          />
          <CardItem
            title="Estado"
            content={collection.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />}
          />
          <CardItem
            title="Imagen principal"
            content={<div className="image">
              {/* <Image alt={collection.name} fill src={collection.image} /> */}
            </div>}
          />
        </Card>
      </Page>
      <Modal
        visible={editing}
        loadingState={saving /* || uploading */}
        onOk={handleSubmit(onSubmit)}
        onCancel={() => {
          setEditing(false)
        }}
        title='Editar colección'
        onClose={() => {
          setEditing(false)
        }}
      >
        {renderForm()}
      </Modal>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  return createServerSideFetcher(context, {
    endpoint: "/api/collections/:code",
    dataKey: "collection",
    propKey: "collection",
    paramKey: "code"
  });
}

CollectionDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="CollectionDetailsPage">
      {page}
    </Layout>
  );
};

export default CollectionDetailsPage