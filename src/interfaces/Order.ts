import { OrderStatus, PaymentMethod } from "@/utils/types"
import { CartInterface, CartItemInterface, UserInterface } from "."
export interface OrderInterface {
  _id: string
  number: string,
  user: UserInterface,
  name: string
  email: string,
  phone: string
  cart: CartInterface,
  subTotal: number
  total: number
  shippingFee: number
  paymentMethod: PaymentMethod,
  status: OrderStatus
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
  products: CartItemInterface[]
  createdAt: Date
  createdBy: UserInterface,
  type: string,
}