import { DiscountInterface, ProductInterface, UserInterface } from '.';

export interface CartInterface {
  _id: string
  items: CartItemInterface[],
  completed: boolean
  discount: DiscountInterface,
  user: UserInterface,
  email: string
}

export interface CartItemInterface extends ProductInterface {
  cartItemId?: string
}
