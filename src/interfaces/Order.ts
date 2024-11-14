import { CartInterface, ProductInterface, UserInterface } from "."

export type PaymentMethod = 'paypal' | 'stripe'

export interface OrderInterface {

  _id: string

  number: string,

  user: UserInterface,

  guestUser: {
    name: string
    email: string,
    phone: string
  },

  cart: CartInterface,

  subTotal: number

  total: number

  shippingFee: number

  paymentMethod: PaymentMethod,

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

  createdAt: Date

  createdBy: UserInterface,

  type: string,
}