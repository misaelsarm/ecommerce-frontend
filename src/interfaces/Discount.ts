import { CollectionInterface, ProductInterface } from "."

export interface DiscountInterface {
  name: string,
  type: {
    label: string,
    value: string
  }
  value: number,
  active: boolean
  startDate: string
  endDate: string
  applicableProducts?: ProductInterface[]; // List of products the discount applies to
  applicableCollections?: CollectionInterface[]; // List of collections the discount applies to
}