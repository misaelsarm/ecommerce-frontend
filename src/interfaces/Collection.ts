import { ProductInterface } from "./Product"

export interface CollectionInterface {
  _id: string
  name: string,
  code: string,
  description: string,
  image: string,
  active: boolean,
  keywords: string,
  parentCollection?: CollectionInterface
  products?: ProductInterface[] 
}