import { api } from "@/api_config/api"
import Layout from "@/components/admin/Layout"
import { Sortable } from "@/components/admin/Sortable"
import Checkbox from "@/components/common/Checkbox"
import Input from "@/components/common/Input"
import Modal from "@/components/common/Modal"
import Select from "@/components/common/Select"
import TextArea from "@/components/common/TextArea"
import { AttributeInterface, CollectionInterface, ProductInterface } from "@/interfaces"
import { makeRequest } from "@/utils/makeRequest"
import { numberWithCommas } from "@/utils/numberWithCommas"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import Chip from "@/components/common/Chip"

interface Props {
  collection: CollectionInterface,
  collections: CollectionInterface[],
}

const CollectionDetailsPage = ({ collection, collections }: Props) => {

  const [editing, setEditing] = useState(false)

  const { register, handleSubmit, control, formState: { errors } } = useForm<any>({
    defaultValues: {
      name: collection.name,
      description: collection.description,
      keywords: collection.keywords,
      parentCollection: collection.parentCollection?._id,
      active: collection.active,
    }
  });

  const [saving, setSaving] = useState(false)

  const { replace, back } = useRouter()

  const [uploading, setUploading] = useState(false)

  const imageRef = useRef<any>()

  const [image, setImage] = useState(collection.image)

  //const { handleFileUpload, uploading } = useFileUpload();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    // if (file) {
    //   const data = await handleFileUpload(file);
    //   setImage(data as string)
    // }
  };

  const onSubmit = async (values: any) => {

    console.log({ values })

    //if (images.length === 0) return toast.error('Elige al menos 1 imagen')


    try {
      setSaving(true)
      const update = {
        ...values,
        parentCollection: values.parentCollection?.value,
        image,
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
          options={collections.map(col => ({
            label: col.name,
            value: col._id
          }))}
          name="parentCollection"
          label="Colección agrupadora"
        />
        <Input
          register={register}
          label='Palabras clave'
          placeholder=''
          name='keywords'
        />
        <Checkbox
          label='Activa'
          id='active'
          name='active'
          register={register}
        />
        <div className="input-group">
          <label htmlFor="">Subir imagen principal</label>
          <input
            onChange={onFileChange}
            ref={imageRef}
            style={{ display: 'none' }}
            type='file'
            accept='image/*'
          />
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center' }}>
            {
              image !== '' &&
              <div
                className='imagePreview'>
                <button onClick={() => imageRef.current.click()} className='btn delete'>Elegir otra imagen</button>
                <img src={image} alt='' />
              </div>
            }
            {
              image === '' &&
              <div onClick={() => { imageRef.current.click() }} style={
                {
                  width: 150,
                  height: 150,
                  border: '2px dashed #cdcdcd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: 14,
                  cursor: 'pointer',
                  marginLeft: image ? 20 : 0,
                  flexShrink: 0
                }
              }>
                <span>
                  Elegir imagen
                </span>
              </div>
            }
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='detailPage'>
        <>
          <div className="page-actions">
            <button
              style={{
                cursor: 'pointer'
              }}
              onClick={() => {
                back()
              }}
              className='back'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg></button>
            {
              !editing && <button className='btn btn-black' onClick={async () => {
                setEditing(true)
              }}>Editar</button>
            }
          </div>
          <div className="card">
            <>
              <div className="cardItem">
                <h4>Nombre</h4>
                <span>{collection.name}</span>
              </div>
              <div className="cardItem">
                <h4>Código</h4>
                <span>{collection.code}</span>
              </div>
              <div style={{
                whiteSpace: 'pre-line'
              }} className="cardItem">
                <h4>Descripcion</h4>
                <span>{collection.description}</span>
              </div>
              {
                collection.parentCollection &&
                <div className="cardItem">
                  <h4>Colección agrupadora</h4>
                  <span>{collection.parentCollection?.name}</span>
                </div>
              }
              <div className="cardItem">
                <h4>Palabras clave</h4>
                <span>{collection.keywords}</span>
              </div>
              <div className="cardItem">
                <h4>Activo</h4>
                <span>{collection.active ? 'Si' : 'No'}</span>
              </div>

              <div className="cardItem">
                <h4>Imagenes</h4>
                <div className='flex wrap'>
                  {/* {
                    collection.images.map(image => (
                      <div key={image} className='mr-20 mb-20'>
                        <img style={{ width: 150, flexShrink: 0 }} src={image} alt="" />
                      </div>
                    ))
                  } */}
                </div>
              </div>
            </>
          </div>
        </>
      </div >
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const code = params?.code

  try {

    // Fetch the specific collection by code
    const collectionResponse = await api.get(`/api/collections/${code}`)
    const collection = collectionResponse.data.collection

    // Fetch all collections
    const collectionsResponse = await api.get(`/api/collections`)
    const collections = collectionsResponse.data.collections

    return {
      props: {
        collection,
        collections
      }
    }
  } catch (error: any) {
    return {
      props: {
        collection: {},
        collections: [],
        error: error.response.data.message || 'An error ocurred.'
      }
    }
  }
}

CollectionDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="CollectionDetailsPage">
      {page}
    </Layout>
  );
};

export default CollectionDetailsPage