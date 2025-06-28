import { AuthContext } from "@/context/auth/AuthContext";
import { OrderInterface } from "@/interfaces";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import styles from '@/styles/Account.module.scss'
import Link from "next/link";
import Input from "@/components/common/Input/Input";

const Account = () => {

  const { register } = useForm();

  const { user, setUser } = useContext(AuthContext)

  const [editing, setEditing] = useState(false);

  const [orders, setOrders] = useState<OrderInterface[]>([]);

  const { query, replace } = useRouter()

  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (user.id) {
  //       try {
  //         const { data } = await api.get(`/api/orders?customer=${user.id}`, {
  //           headers: {
  //             "x-access-token": Cookies.get('token')
  //           }
  //         })
  //         setOrders(data.orders)
  //         setLoading(false)
  //       } catch (error) {
  //         setLoading(false)
  //       }
  //     }
  //   }
  //   fetchData()
  // }, [user])

  const logOut = () => {
    // setUser({} as User)
    // Cookies.remove('token')
    // replace('/')
  }

  if (loading) return 'Loading...'

  return (
    <>
      <div className={styles.account}>
        <div className={styles.topbar}>
          <Link
            href={{ pathname: '/account', query: { tab: 'profile' } }}
          >
            Perfil
          </Link>
          <Link
            href={{ pathname: '/account', query: { tab: 'orders' } }}
          >
            Pedidos
          </Link>

        </div>
        <div className={styles.content}>
          {
            (query.tab === 'profile' || !query.tab) &&
            <div className={styles.profile}>
              <div className={styles.header}>
                <div className={styles.icon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                {
                  !editing &&
                  <button onClick={() => {
                    setEditing(true)
                  }} className='btn btn-black'>Editar</button>
                }
                {
                  editing &&
                  <div>
                    <button onClick={() => {
                      setEditing(false)
                    }} className='btn btn-white'>Cancelar</button>
                    <button onClick={() => {
                      setEditing(true)
                    }} className='btn btn-black'>Guardar</button>
                  </div>
                }
              </div>
              <div className={styles.fields}>
                <div className={styles.group}>
                  <label htmlFor="">Nombre</label>
                  <Input disabled={!editing} name='name' defaultValue={user.name} register={register} />
                </div>
                <div className={styles.group}>
                  <label htmlFor="">Correo electrónico</label>
                  <Input disabled={!editing} name='email' defaultValue={user.email} register={register} />
                </div>
                <div className={styles.group}>
                  <button
                    onClick={logOut}
                    className='btn btn-black'>Cerrar sesión</button>
                </div>
              </div>
            </div>
          }
          {
            query.tab === 'orders' &&
            <div className="orders">
              {
                orders.length === 0 ?
                  <div className='empty'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                    </svg>
                    <h2>No hay pedidos aún</h2>
                    <Link className="btn btn-pink btn-block" href='/products'>
                      Explorar tienda
                    </Link>
                  </div> :
                  <div className={styles.orderList}>
                    <h3>Historial de pedidos</h3>
                    <table className={styles.table}>
                      <thead className={styles.header}>
                        <tr>
                          <th>No. de pedido</th>
                          <th>Fecha</th>
                          <th>Estado</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody className={styles.data}>
                        {
                          orders.map(order => (
                            <tr className={styles.row} key={order.number}>
                              <td>
                                <Link
                                  href={`/account/orders/${order.number}`}
                                >
                                  <>
                                    {order.number}
                                  </>
                                </Link>
                              </td>
                              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td>{order.status}</td>
                              <td>${order.total} MXN</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>


                  </div>
              }
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default Account
