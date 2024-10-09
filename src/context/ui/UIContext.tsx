import { CollectionInterface, ProductInterface } from "@/interfaces"
import { createContext } from "react"
export interface UIContextInterface {
  visible?: boolean,
  setVisible: (visible: boolean) => void
  searchVisible?: boolean,
  setSearchVisible: (visible: boolean) => void
  modalType: string,
  setModalType: (modalType: string) => void,
  products: ProductInterface[],
  setProducts: (products: ProductInterface[]) => void,
  collections: CollectionInterface[],
  setCollections: (collections: CollectionInterface[]) => void
 // categoriesVisible: boolean,
  //setCategoriesVisible: (visible: boolean) => void
}

export const UIContext = createContext({} as UIContextInterface)