import { AuthContext } from "@/context/auth/AuthContext";
import { UIContext } from "@/context/ui/UIContext";
import useFileUpload from "@/hooks/useFileUpload";
import { CartInterface } from "@/interfaces";
import { makeRequest } from "@/utils/makeRequest";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import styles from '@/styles/Checkout.module.scss'
import statesData from '@/utils/states.json'
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import TextArea from "@/components/common/TextArea";
import Checkbox from "@/components/common/Checkbox";
import { cfdiUsos } from "@/utils/cfdi";
import CartSummary from "@/components/CartSummary";

const Checkout = () => {

  const [current, setCurrent] = useState(0)

  const [shippingFee, setShippingFee] = useState(100)

  let states = Object.keys(statesData)

  const [currentState, setCurrentState] = useState("")

  const imageRef = useRef<any>()

  const [fileName, setFileName] = useState('')

  const [fileUrl, setFileUrl] = useState("")

  //const { handleFileUpload, uploading } = useFileUpload();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    // if (file) {
    //   setFileName(file.name)
    //   const data = await handleFileUpload(file) as string;
    //   setFileUrl(data)
    // }
  };

  const [steps, setSteps] = useState([
    {
      id: 0,
      editing: true
    },
    {
      id: 1,
      editing: true
    },
    {
      id: 2,
      editing: true
    },
  ])

  const [confirmation, setConfirmation] = useState(false);

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm
    ();

  const [invoiceRequired, setInvoiceRequired] = useState(false)

  const [data, setData] = useState({
    customer: '',
    email: '',
    phone: '',
    shippingAddress: {
      city: '',
      street: '',
      colonia: '',
      postalCode: '',
      state: ''
    },
    tax: {
      razonSocial: '',
      rfc: '',
      direccionFiscal: '',
      usoCfdi: {
        label: '',
        value: ''
      },
      fileUrl: ''
    },
    total: 0
  })

  const [cart, setCart] = useState({} as CartInterface)

  const [items, setItems] = useState([])

  const [originalTotal, setOriginalTotal] = useState(0)

  const [total, setTotal] = useState(0)

  const [discountedAmount, setDiscountedAmount] = useState(0)

  //const [subTotal, setSubTotal] = useState(0)

  //const [subTotalWithoutDiscounts, setSubTotalWithoutDiscounts] = useState(0)

  //const [paypalVisible, setPaypalVisible] = useState(false)

  const [loading, setLoading] = useState(true)

  const { query, replace } = useRouter()

  const { setVisible, setModalType } = useContext(UIContext)

  const { user } = useContext(AuthContext)

  const fetchCart = async () => {
    //setPaypalVisible(false)
    try {
      const data = await makeRequest('get', `/api/cart/${query.checkout}`)

      if (data.cart.completed) {
        replace('/')
      }
      setLoading(false)
      setCart(data.cart)
      setItems(data.items)
      setDiscountedAmount(data.discountedAmount)
      setOriginalTotal(data.originalTotal)
      setTotal(data.total)
      /* setSubTotal(data.subTotal)
      setSubTotalWithoutDiscounts(data.subTotalWithoutDiscounts) */
      if (data.subTotalWithoutDiscounts > 999) {
        setShippingFee(0)
      } else {
        setShippingFee(100)
      }
    } catch (error) {
    }
  }

  const completePayment = async () => {
    setWaiting(true)
    setConfirmation(true)
    const order = {
      ...data,
      shippingAddress: {
        ...data.shippingAddress,
      },
      shippingFee,
      cart: cart._id,
      userId: user._id,
      invoiceRequired,
      tax: {
        razonSocial: data.tax.razonSocial,
        rfc: data.tax.rfc,
        usoCfdi: data.tax.usoCfdi,
        direccionFiscal: data.tax.direccionFiscal,
        fileUrl
      },
      deviceInfo: {
        isMobile,
        isTablet,
        isDesktop,
        browserName,
        browserVersion,
        operatingSystem,
        screenWidth,
        screenHeight,
      }
    }

    if (!user._id) {
      //@ts-ignore
      delete order.userId
      //@ts-ignore
      order.guestUser = {
        name: data.customer,
        email: data.email,
        phone: data.phone
      }
    }


    try {
      await makeRequest('post', '/api/orders/createOrder', order)
      setWaiting(false)
      localStorage.removeItem('cartId')
    } catch (error: any) {
      console.log({ error })
      toast.error(error.reponse.data.message)
      setWaiting(false)
    }
  }

  // useEffect(() => {
  //   if (user.token) {
  //     reset({
  //       customer: user.name,
  //       email: user.email
  //     })
  //   }
  // }, [user])

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [browserName, setBrowserName] = useState('');
  const [browserVersion, setBrowserVersion] = useState('');
  const [operatingSystem, setOperatingSystem] = useState('');
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent;

    const getBrowserVersion = () => {
      const userAgent = navigator.userAgent;

      let version = '';
      if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(userAgent)) {
        // For Firefox
        version = userAgent.match(/rv:([^\)]+)\) Gecko\/\d{8}/)?.[1] ?? '';
      } else if (/Edge\/([\d\.]+)/.test(userAgent)) {
        // For Microsoft Edge
        version = userAgent.match(/Edge\/([\d\.]+)/)?.[1] ?? '';
      } else if (/OPR\/([\d\.]+)/.test(userAgent)) {
        // For Opera
        version = userAgent.match(/OPR\/([\d\.]+)/)?.[1] ?? '';
      } else if (/Chrome\/([\d\.]+)/.test(userAgent)) {
        // For Chrome
        version = userAgent.match(/Chrome\/([\d\.]+)/)?.[1] ?? '';
      } else if (/Version\/([\d\.]+) Safari/.test(userAgent)) {
        // For Safari
        version = userAgent.match(/Version\/([\d\.]+) Safari/)?.[1] ?? '';
      } else if (/MSIE ([\d\.]+)/.test(userAgent)) {
        // For Internet Explorer
        version = userAgent.match(/MSIE ([\d\.]+)/)?.[1] ?? '';
      }

      return version;
    };

    const getOperatingSystem = (userAgent: string): string => {
      const osRegex: { [key: string]: RegExp } = {
        Windows: /Windows NT (\d+\.\d+)/,
        macOS: /Mac OS X (\d+)[_.](\d+)(?:[_.](\d+))?/,
        iOS: /OS (\d+)[_.](\d+)(?:[_.](\d+))?/,
        Android: /Android (\d+\.\d+)/,
        Linux: /Linux/,
      };

      for (const os in osRegex) {
        if (osRegex[os].test(userAgent)) {
          const versionMatches = userAgent.match(osRegex[os]);
          const version = versionMatches && versionMatches.length > 1 ? versionMatches.slice(1).filter(Boolean).join('.') : '';
          return `${os} ${version}`;
        }
      }

      return '';
    };


    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
    setIsTablet(/iPad|Android/i.test(userAgent));
    setIsDesktop(!isMobile && !isTablet);
    setBrowserName(userAgent ?? '');
    setBrowserVersion(getBrowserVersion());
    setOperatingSystem(getOperatingSystem(userAgent));
    setScreenWidth(window?.screen?.width ?? 0);
    setScreenHeight(window?.screen?.height ?? 0);
  }, []);


  useEffect(() => {
    if (!query.checkout) return
    const fetchData = async () => {
      fetchCart()
    }
    fetchData()
  }, [query])

  const next = () => {
    const form = [...steps]
    form[current].editing = false
    form[current + 1].editing = true
    setSteps(form)
    setCurrent(current + 1)
  }

  const onSubmit = async (values: any) => {

    setData({
      ...data,
      ...values,
      shippingAddress: {
        city: values.city?.value,
        street: values.street,
        colonia: values.colonia,
        postalCode: values.postalCode,
        country: 'MX',
        state: values.state?.value
      },
      tax: {
        razonSocial: values.razonSocial,
        rfc: values.rfc,
        usoCfdi: values.usoCfdi,
        direccionFiscal: values.direccionFiscal
      }
    })

    if (current === 1) {
      if (fileUrl === "" && invoiceRequired) {
        return toast.error('Falta cargar constancia de situación fiscal');
      } else {
        //setPaypalVisible(true);
      }
    }

    if (current === 0 || current === 1) {
      next();
    }

    if (current === 2) {
      completePayment();
    }

  }

  if (loading) return <span></span>

  return (
    <>
      <>
        <div className={styles.checkout}>
          <div className={styles.summary}>
            <CartSummary
              discount={cart.discount}
              shippingFee={shippingFee}
              cart={cart}
              items={items}
              fetchCart={fetchCart}
              originalTotal={originalTotal}
              total={total}
              discountedAmount={discountedAmount}
            //subTotal={subTotal}
            //subTotalWithoutDiscounts={subTotalWithoutDiscounts}
            />
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.title}>
                <span className={styles.number}>1</span>
                <span>Información de contacto</span>
                {
                  !steps[0].editing &&
                  <button
                    onClick={() => {
                      const form = [...steps]
                      form[0].editing = true
                      setCurrent(0)
                      setSteps(form)
                    }}
                    className='btn btn-white'>Cambiar</button>
                }
              </div>
              {
                !steps[0].editing &&
                <div className={styles.stepInfo}>
                  <span>{data.customer}</span>
                  <span>{data.email}</span>
                  <span>{data.phone}</span>
                </div>
              }
              {
                current === 0 &&
                <div className={styles.content}>
                  <Input
                    name='customer'
                    errors={errors}
                    label='Nombre y apellido'
                    register={register}
                    required
                  />
                  <Input
                    type='email'
                    name='email'
                    errors={errors}
                    label='Correo electrónico'
                    register={register}
                    required
                    pattern={/^\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*$/}
                  />
                  <Input
                    name='phone'
                    errors={errors}
                    label='Teléfono'
                    register={register}
                    required
                    inputMode='numeric'
                  />
                  {/* {
                    !user.token &&
                    <span onClick={() => {
                      setVisible(true)
                      setModalType('login')
                    }} className={styles.login}>¿Ya tienes cuenta? <span> Iniciar sesión</span></span>
                  } */}
                  <button onClick={handleSubmit(onSubmit)} className='btn btn-black'>Continuar con envío</button>
                </div>
              }
            </div>
            <div className={styles.step}>
              <div className={styles.title}>
                <span className={styles.number}>2</span>
                <span>Informacion de envío</span>
                {
                  !steps[1].editing &&
                  <button
                    onClick={() => {
                      setCurrent(1)
                      const form = [...steps]
                      form[1].editing = true
                      setSteps(form)
                    }}
                    className='btn btn-white'>Cambiar</button>
                }
              </div>
              <span style={{ display: 'block', marginBottom: 20 }}>Para pedidos que incluyan productos personalizados, considera un tiempo de elaboración adicional de 1 a 3 días hábiles además del período de entrega estándar de 2 a 5 días hábiles.</span>
              {
                !steps[1].editing &&
                <div className={styles.stepInfo}>
                  <span>{data.shippingAddress.street}, {data.shippingAddress.colonia}, {data.shippingAddress.postalCode}, {data.shippingAddress.city}, {data.shippingAddress.state}, México</span>
                  {
                    invoiceRequired &&
                    <>
                      <br></br>
                      <span>Datos de facturación</span>
                      <span>{data.tax.razonSocial}</span>
                      <span>{data.tax.rfc}</span>
                      <span>{`${data.tax.usoCfdi.label}`}</span>
                      <span>{data.tax.direccionFiscal}</span>
                    </>
                  }
                </div>
              }
              {
                current === 1 &&
                <div className={styles.content}>
                  <>
                    <Select
                      control={control}
                      placeholder='Estado'
                      name='state'
                      options={states.map(item => ({
                        value: item,
                        label: item
                      }))}
                      required
                      errors={errors}
                      onChange={async (e: any) => {
                        setCurrentState(e.value)
                      }}
                    />
                    <Select
                      control={control}
                      placeholder='Ciudad'
                      name='city'
                      //@ts-ignore
                      options={statesData[currentState]?.map((item: string) => ({
                        value: item,
                        label: item
                      }))}
                      required
                      errors={errors}
                    />
                    <Input
                      name='street'
                      errors={errors}
                      placeholder='Calle y número'
                      register={register}
                      required
                    />
                    <Input
                      name='colonia'
                      errors={errors}
                      placeholder='Colonia'
                      register={register}
                      required
                    />
                    <Input
                      name='apartment'
                      errors={errors}
                      placeholder='Apartamento, suite, etc. (Opcional)'
                      register={register}
                    />
                    <Input
                      name='postalCode'
                      errors={errors}
                      placeholder='Codigo Postal'
                      register={register}
                      required
                      inputMode='numeric'
                    />
                  </>
                  <TextArea
                    name='specialInstructions'
                    register={register}
                    placeholder='Instrucciones de entrega'
                  />
                  <Checkbox
                    register={register}
                    id='invoiceRequired'
                    name='invoiceRequired'
                    label='Requiero factura'
                    onChange={(e: any) => {
                      setInvoiceRequired(e.target.checked)
                    }}
                  />
                  {
                    invoiceRequired &&
                    <div>
                      <Input
                        name='razonSocial'
                        errors={errors}
                        placeholder='Razón Social'
                        register={register}
                        required
                      />
                      <Input
                        name='rfc'
                        errors={errors}
                        placeholder='RFC'
                        register={register}
                        required
                      />
                      <Input
                        name='direccionFiscal'
                        errors={errors}
                        placeholder='Dirección de facturación'
                        register={register}
                        required
                      />
                      <Select
                        control={control}
                        placeholder='Uso de CFDI'
                        name='usoCfdi'
                        options={cfdiUsos.map((item) => ({
                          value: item.clave,
                          label: `${item.clave} - ${item.descripcion}`
                        }))}
                        required
                        errors={errors}
                      />
                      <div className='group'>
                        <label>Cargar Constancia de Situación Fiscal</label>
                        <input
                          onChange={onFileChange}
                          ref={imageRef}
                          style={{ display: 'none' }}
                          type='file'
                          accept='application/pdf'
                        />
                        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center' }}>
                          {
                            fileUrl !== '' &&
                            <div

                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%'
                              }}                            >
                              <div
                                style={
                                  {
                                    width: '100%',
                                    height: 50,
                                    border: '2px dashed #cdcdcd',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    fontSize: 14,
                                    flexShrink: 0,
                                    marginBottom: 10
                                  }}
                              >
                                <span>{fileName}</span>
                              </div>
                              <button onClick={() => imageRef.current.click()} className='btn btn-block'>Elegir otro archivo</button>
                            </div>
                          }
                          {
                            fileUrl === '' &&
                            <div onClick={() => { imageRef.current.click() }} style={
                              {
                                width: '100%',
                                height: 50,
                                border: '2px dashed #cdcdcd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                fontSize: 16,
                                cursor: 'pointer',
                                flexShrink: 0
                              }
                            }>
                              <span>
                                Elegir archivo
                              </span>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  }
                  <button /* disabled={waiting || uploading}  */ onClick={handleSubmit(onSubmit)} className='btn btn-black'>
                    {
                      waiting ? 'Espera...' : 'Continuar con método de pago'
                    }
                  </button>
                </div>
              }
            </div>
            <div className={styles.step}>
              <div className={styles.title}>
                <span className={styles.number}>3</span>
                <span>Método de pago</span>
              </div>
              {
                (current === 2) &&
                <div className={styles.content}>
                  <span>Serás redirigido a otra pestaña para finalizar tu compra. Por favor no cierres la ventana hasta haber concluido tu pago.</span>
                  {/* <div className='paymentMethods__paypal'>
                    <span className='text'>Completar compra con PayPal</span>
                    <br></br>
                    {
                      <PayPal
                        amount={total}
                        handleSubmit={completePayment}
                      />
                    }
                  </div> */}
                  <>

                  </>

                  <button
                    //disabled={waiting}
                    onClick={handleSubmit(onSubmit)}
                    className='btn btn-black'
                  >
                    {
                      waiting ? 'Completando orden. Espera...' : 'Completar compra'
                    }
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </>
      {/* {
        confirmation &&
        <OrderConfirmationModal waiting={waiting} />
      } */}
    </>
  )
}

const CheckoutWrapper = () => {
  return (
    <Checkout />
  )
}

export default CheckoutWrapper
