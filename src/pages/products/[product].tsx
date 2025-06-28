import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from '@/styles/ProductDetails.module.scss'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'

//import 'react-image-crop/src/ReactCrop.scss'

import { useWindowWidth } from '@/hooks/useWindowWidth'
import Link from 'next/link'

//import useFileUpload from '@/hooks/useFileUpload'
import { AttributeInterface, CartInterface, ProductInterface } from '@/interfaces'
import Notification from '@/components/online-store/Notification'
import Modal from '@/components/common/Modal/Modal'
import { makeRequest } from '@/utils/makeRequest'

interface Props {
  product: ProductInterface,
}

const Product: NextPage<Props> = ({ product }) => {

  console.log({ product })

  const logoRef = useRef<any>()

  // const [crop, setCrop] = useState<Crop>(product.crop)

  const [previewVisible, setPreviewVisible] = useState(false)

  const { handleSubmit, register, formState: { errors }, watch } = useForm<any>({
    defaultValues: {
      type: "Texto"
    }
  })

  const [fontSize, setFontSize] = useState(16);

  const [logo, setLogo] = useState("")

  const [loading, setLoading] = useState(false)

  const [notificationVisible, setNotificationVisible] = useState(false)

  const [title, setTitle] = useState('')

  const [image, setImage] = useState(product.images[0])

  const selectedCustomization = watch("type")
  const selectedPosition = watch("position")
  const previewFont = watch("font")
  const text = watch("text")
  const size = watch("size")


  useEffect(() => {
    setImage(product.images[0])
  }, [product.images])

  const fonts = [
    {
      name: 'Bebas',
      className: 'Bebas',
      number: 1
    },
    {
      name: 'Beyond The Mountains',
      className: 'BeyondTheMountains',
      number: 2
    },
    {
      name: 'Chocolate',
      className: 'ChocolateFont',
      number: 3
    },
    {
      name: 'Jenna Sue',
      className: 'JennaSue',
      number: 5
    },
    {
      name: 'Lemon Milk',
      className: 'LemonMilk',
      number: 6
    },
    {
      name: 'Pinky Cupid',
      className: 'PinkyCupid',
      number: 7
    },
    {
      name: 'Remachine Script',
      className: 'RemachineScript',
      number: 8
    },
    {
      name: 'Rocky Monkey',
      className: 'RockyMonkey',
      number: 9
    },
    {
      name: 'Saginaw',
      className: 'Saginaw',
      number: 10
    },
    {
      name: 'Slightly Marker',
      className: 'SlightlyMarker',
      number: 11
    }
  ]

  const discount = {
    textDecoration: 'line-through',
    color: 'gray',
    fontWeight: 'normal'
  }

  function solveProportion(a: number, b: number, c: number) {
    return (a * c) / b;
  }

  // function gtag_report_conversion(url:string) {
  //   var callback = function () {
  //     if (typeof(url) !== 'undefined') {
  //       //@ts-ignore
  //       window.location = url;
  //     }
  //   };
  //    //@ts-ignore
  //   window.gtag('event', 'conversion', {
  //     'send_to': 'AW-11283385789/pBksCJWaw_oYEL2bq4Qq',
  //     'transaction_id': '',
  //     'event_callback': callback
  //   });
  // }

  // Function to trigger the conversion on button click
  /* function handleButtonClick() {
    // Call the Google Ads Conversion API function when the button is clicked
    gtag_report_conversion('/');
  } */

    const onSubmit = async (values: any) => {

      const mensajeEnGlobo = {
        id: uuidv4(),
        longName: 'Mensaje en globo',
        shortName: 'Mensaje en globo',
        //values: `${line1}(${font1}) ${line2}(${font2})`
      }
  
      const attributes = product.attributes.map(attr => {
        return {
          id: attr._id,
          shortName: attr.shortName,
          longName: attr.longName,
          values: values[attr._id],
        }
      }).filter(item => item.shortName !== 'Mensaje en globo')
  
      let finalAttributes = []
  
      if (
        product.attributes.map(item => item.shortName).includes('Mensaje en globo')
      ) {
        finalAttributes = [mensajeEnGlobo, ...attributes]
      } else {
        finalAttributes = attributes
      }
      const cartId = localStorage.getItem('cartId')
  
      const productAdded = {
        ...product,
        attributes: finalAttributes,
        cartItemId: uuidv4(),
        cartId,
        productId: product._id
      }
  
      setLoading(true)
      try {
        const data = await makeRequest('post', '/api/cart', productAdded)
        const cart = data.cart
        if (cartId !== cart._id) {
          localStorage.setItem('cartId', cart._id)
        }
        setNotificationVisible(true)
        setTitle('Agregado al carrito')
        setLoading(false)
      } catch (error: any) {
        toast.error(error.response.data.message)
        setLoading(false)
      }
    }

  // const renderPosition = () => {
  //   let top = 0
  //   switch (selectedPosition) {
  //     case "Arriba":
  //       top = crop?.y
  //       break;
  //     case "Enmedio":
  //       top = crop?.y + ((crop?.height - 20) / 2)
  //       break;
  //     case "Abajo":
  //       top = crop?.y + crop?.height - 20
  //       break;
  //     default:
  //       top = crop?.y + ((crop?.height - 20) / 2)
  //       break;
  //   }
  //   return top
  // }

  // useEffect(() => {
  //   setFontSize(calculateFontSize());
  // }, [text, size])

  const windowWidth = useWindowWidth()

  const uploadImage1 = async (e: any) => {

    // const file = e.target.files?.[0];
    // if (file) {
    //   const data = await handleFileUpload(file) as string;
    //   setLogo(data)
    // }
  }

  //const { handleFileUpload } = useFileUpload();

  // function calculateFontSize() {

  //   const width = crop?.width
  //   const length = text?.length || 15;
  //   //@ts-ignore
  //   const widthPerCharacter = width / length;

  //   switch (size) {
  //     case "4cm":
  //       return 14;
  //     case "6cm":
  //       return 20;
  //     case "8cm":
  //       return 24;
  //     default:
  //       return 20;
  //   }
  // }

  // useEffect(() => {
  //   if (windowWidth <= 768 && crop) {
  //     const x = solveProportion(crop?.x, 550, 350)
  //     const y = solveProportion(crop?.y, 550, 350)
  //     const width = solveProportion(crop?.width, 550, 350)
  //     const height = solveProportion(crop?.height, 550, 350)
  //     setCrop({
  //       ...crop,
  //       width,
  //       height,
  //       x,
  //       y,
  //     })
  //   } else {
  //     setCrop(product.crop)
  //   }
  // }, [windowWidth])

  const renderAttribute = (attribute: AttributeInterface) => {

    switch (attribute.type) {
      case 'dropdown':
        return (
          <>
            <label>{attribute.longName}</label>
            <select
              {...register(attribute._id,
                {
                  required: true
                })}
              className='input'>
              {
                attribute.values.map(value => (
                  <option key={value.value} value={JSON.stringify(value)}>{value.label}</option>
                ))
              }
            </select>
            {
              errors[attribute._id] && <span style={{ color: 'red', display: 'block', marginTop: 10 }}>Requerido</span>
            }
          </>
        )

      case 'color':
        return (
          <>
            <span>{attribute.longName}</span>
            <div className="colors">
              {
                attribute.values.map((value) => (
                  <div
                    key={value.value} className="color">
                    <input
                      {...register(attribute._id, {
                        required: true
                      })}
                      type="checkbox"
                      value={JSON.stringify(value)}
                      id={`${value.value}-${attribute._id}`}
                    />
                    <label
                      data-tip={value.label}
                      style={{
                        backgroundSize: 'cover',
                        background: value?.value?.startsWith('https') ? `url(${value.value})` : value.value
                      }}
                      htmlFor={`${value.value}-${attribute._id}`}></label>
                  </div>
                ))
              }
            </div>
            {
              errors[attribute._id] && <span style={{ color: 'red', display: 'block', marginTop: 10 }}></span>
            }
          </>
        )

      case 'long-text':
        return (
          <div>
            {/* <LongText {...attribute} register={register} errors={errors} /> */}
          </div>

        )
      case 'short-text':
        return (
          <>
            <label htmlFor="">{attribute.longName}</label>
            <input
              {...register(attribute._id, {
                required: {
                  value: true,
                  message: 'Requerido'
                },
                maxLength: {
                  value: attribute.max,
                  message: `Maximo ${attribute.max} caracteres`
                }
              })}
              className='input'
            ></input>
            {
              errors[attribute._id] && <span style={{ color: 'red', display: 'block', marginTop: 10 }}>{(errors[attribute._id] as any).message}</span>
            }
          </>
        )
      case 'font':
        return (
          <>
            <label htmlFor="">{attribute.longName}</label>
            {/* <div className={styles.col}>
              <div className={styles.row}>
                <input onChange={(e) => {
                  setLine1(e.target.value)
                }} placeholder='Tu texto aquí' className='input' type="text" />
                <select onChange={(e) => {
                  setFont1(e.target.value)
                }} className='input' name="" id="">
                  {classNames.map(font => (
                    <option key={font.number} value={font.number}>{font.number}-{font.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.row}>
                <input onChange={(e) => {
                  setLine2(e.target.value)
                }} placeholder='Tu texto aquí' className='input' type="text" />
                <select onChange={(e) => {
                  setFont2(e.target.value)
                }} className='input' name="" id="">
                  {classNames.map(font => (
                    <option key={font.number} value={font.number}>{font.number}-{font.name}</option>
                  ))}
                </select>
              </div>

              <span>Vista previa de tipografías</span>
              <div className={classNames.find(item => (item.number).toString() === font1)?.name}>{line1}</div>
              <div className={classNames.find(item => (item.number).toString() === font2)?.name}>{line2}</div>
            </div> */}
            {/* <input
              {...register(attribute._id, {
                required: true
              })}
              className='input'
              onChange={(e) => {
                setText(e.target.value)
              }}
            ></input>
            {
              errors[attribute._id] && <span style={{ color: 'red', display: 'block', marginTop: 10 }}>Requerido</span>
            } */}
          </>
        )
      default:
        break;
    }

  }

  return (
    <>
      {/* <Layout
        keywords={product.keywords}
        title={product.name}
        image={product.images[0]}
        description={product.description}
      > */}
      {/* <div className={styles.breadCrumb}>
        <Link href={`/categories/${product.subCategories[0].categories[0].code}`}>{product.subCategories[0].categories[0].name}</Link>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>

        <Link href={`/subcategories/${product.subCategories[0].code}`}>{product.subCategories[0].name}</Link>
      </div> */}
      <div className={styles.productDetails}>
        <div className={styles.images}>
          <div className={styles.cover}>
            <Image
              alt={product.name}
              src={image}
              fill
            />
          </div>
          <div className={styles.secondary}>
            {
              product.images.map(image => (
                <div
                  onClick={() => {
                    setImage(image)
                  }}
                  key={image} className={styles.image}>
                  <Image
                    alt={product.name}
                    src={image}
                    layout='fill'
                    objectFit='cover'
                  />
                </div>
              ))
            }

          </div>

        </div>

        <div className={styles.productFields}>
          <div className={styles.info}>
            <h1>{product.name} {
              product.isCustomizable && <>
                | <span>Personalizado</span>
              </>
            }</h1>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {
                product.discount?.hasDiscount &&
                <span style={{ marginBottom: 5 }}>${product.discount.discountValue && product.price - product.discount.discountValue} MXN</span>
              }
              {
                product.soldOut ? `$${product.price.toFixed(2)} MXN - AGOTADO` :
                  <span
                    style={
                      product.discount?.hasDiscount ? discount : undefined
                    }
                  >${product.price.toFixed(2)} MXN</span>
              }
            </div>

          </div>
          <div className={styles.description}>
            <span>{product.description}</span>
          </div>
          {
            product.isCustomizable &&
            <div className={styles.customization}>
              <h2>Personaliza tu producto</h2>
              <div className={styles.attributes}>
                {
                  product.attributes.map(attribute => (
                    <div key={attribute.shortName} className="attribute">
                      {renderAttribute(attribute)}
                    </div>
                  ))
                }
              </div>
            </div>
          }
          <br></br>
          <div className={styles.actions}>
            {
              product.active && !product.soldOut &&
              <>
                <button
                  disabled={loading}
                  onClick={handleSubmit((e) => {
                    onSubmit(e)
                    // handleButtonClick()
                  })}
                  className='btn btn-black btn-block'>
                  {
                    loading ? 'Agregando...' : 'Agregar al carrito'
                  }
                </button>
                {
                  product.isCustomizable && <button onClick={() => setPreviewVisible(true)} className='btn btn-gradient'>Personalizar por 100 MXN</button>
                }
              </>
            }
            {
              !product.active &&
              'Este producto ya no esta disponible.'
            }
          </div>
          {/* <Modal
              wrapperStyle={{
                height: '80vh',
                maxWidth: 1100,
                overflow: 'hidden'
              }}
              onClose={() => {
                setPreviewVisible(false)
              }}
              visible={previewVisible}
              title='Vista previa de personalización' showButtons={false}
            >
              <div className={styles.productPreview}>
                <div className={styles.previewImage}>
                  <ReactCrop
                    maxWidth={550}
                    minHeight={550}
                    aspect={1}
                    crop={crop}
                    disabled
                    onChange={c => setCrop(c)}>
                    <div className='crop-wrapper'>
                      <img src={product.previewImage} />
                      {
                        selectedCustomization === 'Texto' &&
                        <span
                          style={{
                            top: renderPosition(),
                            fontSize,
                            transform: selectedPosition === 'Vertical' ? 'translate(-50%, 0%) rotate(-90deg)' : undefined
                          }}
                          className={previewFont}
                        >
                          {
                            !text ? "Tu texto aquí" : text
                          }
                        </span>
                      }
                    </div>
                  </ReactCrop>
                </div>
                <div className={styles.customization}>
                  <h3>Tipo de personalización</h3>
                  <div className={styles.options}>
                    <Option
                      errors={errors}
                      register={register}
                      name='type'
                      text='Texto'
                      required
                      value='Texto'
                    />
                    <Option
                      errors={errors}
                      register={register}
                      name='type'
                      text='Logo'
                      required
                      value='Logo'
                    />
                  </div>
                  {errors.type &&
                    <span className="error">Requerido</span>
                  }
                  {
                    selectedCustomization === 'Texto' || selectedCustomization === '' ?
                      <>
                        <div className={styles.customName}>
                          <Input
                            label='Escribe aqui tu texto a personalizar'
                            name='text'
                            type='text'
                            register={register}
                            required
                            errors={errors}
                          />
                        </div>
                        <div>
                          <h3>Tipografía</h3>
                          <div className={styles.fonts}>
                            {
                              fonts.map(font => (
                                <Option
                                  errors={errors}
                                  name='font'
                                  className={font.className}
                                  key={font.name}
                                  text={font.name}
                                  register={register}
                                  required
                                  value={font.className}
                                />
                              ))
                            }
                            {errors.font &&
                              <span className="error">Requerido</span>
                            }
                          </div>

                        </div>
                        <div>
                          <h3>Posición</h3>
                          <div className={styles.options}>
                            {
                              (
                                product.subCategories.map(sub => sub.code).includes('pet-bowl-32-oz') ||
                                product.subCategories.map(sub => sub.code).includes('pet-bowl-64-oz')
                              ) ? null :

                                <Option
                                  errors={errors}
                                  name='position'
                                  register={register}
                                  required
                                  text='Arriba'
                                  value='Arriba'
                                />
                            }
                            <Option
                              errors={errors}
                              name='position'
                              register={register}
                              required
                              text='Enmedio'
                              value='Enmedio'
                            />
                            {
                              (
                                product.subCategories.map(sub => sub.code).includes('pet-bowl-32-oz') ||
                                product.subCategories.map(sub => sub.code).includes('pet-bowl-64-oz')
                              ) ? null :
                                <Option
                                  errors={errors}
                                  name='position'
                                  register={register}
                                  required
                                  text='Abajo'
                                  value='Abajo'
                                />
                            }
                            {
                              (
                                product.subCategories.map(sub => sub.code).includes('pet-bowl-32-oz') ||
                                product.subCategories.map(sub => sub.code).includes('pet-bowl-64-oz')
                              ) ? null : <Option
                                errors={errors}
                                name='position'
                                register={register}
                                required
                                text='Vertical'
                                value='Vertical'
                              />
                            }
                            {errors.position &&
                              <span className="error">Requerido</span>
                            }
                          </div>
                        </div>
                        <div>
                          <h3>Tamaño</h3>
                          <div className={styles.options}>
                            <Option
                              errors={errors}
                              register={register}
                              name='size'
                              text='4cm'
                              required
                              value='4cm'
                            />
                            <Option
                              errors={errors}
                              register={register}
                              name='size'
                              text='6cm'
                              value='6cm'
                              required
                            />
                            <Option
                              errors={errors}
                              register={register}
                              name='size'
                              text='8cm'
                              value='8cm'
                              required
                            />
                            {errors.size &&
                              <span className="error">Requerido</span>
                            }
                          </div>
                        </div>
                      </> :
                      <div>
                        <Input
                          label='Correo electrónico'
                          name='email'
                          type='email'
                          register={register}
                          required
                          errors={errors}
                        />
                        <Input
                          name='name'
                          register={register}
                          required
                          errors={errors}
                          label='Nombre'
                        />
                        <Input
                          name='lastName'
                          register={register}
                          required
                          errors={errors}
                          label='Apellido'
                        />
                        <div>
                          <label>Cargar archivo</label>
                          <input
                            onChange={uploadImage1}
                            ref={logoRef}
                            style={{ display: 'none' }}
                            type='file'
                            accept='image/*'
                          />
                          <br />
                          {
                            logo !== '' &&
                            <Image
                              width={200}
                              height={200}
                              src={logo}
                              alt=''
                              style={{
                                objectFit: 'contain'
                              }}
                            />
                          }
                          <div
                            onClick={() => { logoRef.current.click() }}
                            className='btn btn-auto' role='buttton'>
                            <span>Buscar archivo</span>
                          </div>
                        </div>
                      </div>
                  }
                  <button onClick={handleSubmit((e) => {
                    onSubmit(e, true)
                  })} className='btn btn-black'>Agregar al carrito</button>
                </div>
              </div>
            </Modal> */}
        </div>

      </div>
      {/* <div className="container-white">
          <Related title='También te podría interesar...' />
        </div> */}
      {/*  </Layout> */}
      <Notification
        title={title}
        product={product}
        visible={notificationVisible}
        onClose={() => {
          setNotificationVisible(false)
        }}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const { product: id } = params as any
  let product

  try {
    const data = await makeRequest('get', `/api/products/${id}`)

    product = data.product

    if (!product.active) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

  } catch (error: any) {
    console.log(error.response.data.message);
  }

  return {
    props: {
      product
    },
  }
}

export default Product