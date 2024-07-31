import { AttributeInterface, CollectionInterface } from ".";

interface ProductDiscountInterface {
  hasDiscount?: boolean;
  discountType?: {
    label: string,
    value: string
  };
  discountValue?: number;
}

interface InventoryInterface {
  isTracked?: boolean;
  availableQuantity?: number;
}

export interface ProductInterface {

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

  inventory: InventoryInterface,

  collections: CollectionInterface[],

}