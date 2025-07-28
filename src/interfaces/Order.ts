import { OrderStatus, PaymentMethod } from "@/utils/types"
import { CartInterface, CartItemInterface, UserInterface } from "."
import { IShippingAddress } from "./IShippingAddress"

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
  shippingAddress: IShippingAddress,
  products: CartItemInterface[]
  createdAt: Date
  createdBy: UserInterface,
  type: string,
}