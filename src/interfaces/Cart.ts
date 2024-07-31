import { DiscountInterface, UserInterface } from '.';

export interface CartInterface {
  items: any[],
  completed: boolean
  discount: DiscountInterface,
  user: UserInterface,
  email: string
}