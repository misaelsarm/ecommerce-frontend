import { UserInterface } from "./User";

export interface AddressInterface {
  _id: string
  city: string;
  state: string;
  country: string;
  postalCode: string;
  street: string;
  colonia: string;
  apartment?: string;
  deliveryInstructions?: string;
  user: UserInterface
  main: boolean
  receiverName: string,
  receiverPhone: string
}