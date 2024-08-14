import { DiscountInterface, UserInterface } from '.';

export interface CartInterface {
  _id: string
  items: any[],
  completed: boolean
  discount: DiscountInterface,
  user: UserInterface,
  email: string
}