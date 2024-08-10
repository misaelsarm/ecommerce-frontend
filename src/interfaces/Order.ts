import { CartInterface, ProductInterface, UserInterface } from "."

export interface OrderInterface {

  number: string,

  user: UserInterface,

  customer: {
    name: string
    email: string,
    phone: string
  },

  cart: CartInterface,

  subTotal: number

  total: number

  shippingFee: number

  paymentMethod: {
    label: string,
    value: string
  },

  status: string

  shippingAddress: {
    city: string,
    state: string,
    country: string,
    postalCode: string,
    street: string,
    colonia: string
    apartment: string,
    deliveryInstructions: string
  }
  products: ProductInterface[]
}