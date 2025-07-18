import { AttributeInterface, CollectionInterface } from ".";

interface ProductDiscountInterface {
  hasDiscount?: boolean;
  discountType?: 'fixed' | 'percentage'
  discountValue?: number;
}

interface InventoryInterface {
  isTracked?: boolean;
  availableQuantity?: number;
}

export interface ProductInterface {

  //common props

  _id: string

  name: string,

  code: string

  description: string,

  price: number

  images: string[]

  active: boolean,

  soldOut: boolean,

  discount?: ProductDiscountInterface;

  isCustomizable?: boolean

  attributes: AttributeInterface[],

  keywords?: string

  inventory?: InventoryInterface,

  collections: CollectionInterface[],

  deleted: boolean

  createdAt: any


  //store specific props
  minDays?: number

}