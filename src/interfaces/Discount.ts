import { DiscountType, LimitBy } from "@/utils/types"
import { CollectionInterface, ProductInterface } from "."

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