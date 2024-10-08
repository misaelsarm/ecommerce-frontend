import { CollectionInterface, ProductInterface } from "."

// Define a separate type for the attribute type
export type DiscountType = 'Monto fijo' | 'Porcentaje'

export type LimitBy = 'Colección' | 'Producto'

export interface DiscountInterface {
  _id: string
  name: string,
  type: DiscountType,
  value: number,
  active: boolean
  startDate: string
  endDate: string
  limited?: boolean
  limitBy: LimitBy,
  applicableProducts?: ProductInterface[]; // List of products the discount applies to
  applicableCollections?: CollectionInterface[]; // List of collections the discount applies to
}