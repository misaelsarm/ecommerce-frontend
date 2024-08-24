import { SubCategory } from "@/interfaces/SubCategory"
import { createContext } from "react"
import { Product, Category } from "../../interfaces"

export interface UIContextInterface {
  visible?: boolean,
  setVisible: (visible: boolean) => void
  searchVisible?: boolean,
  setSearchVisible: (visible: boolean) => void
  modalType: string,
  setModalType: (modalType: string) => void,
  products: Product[],
  setProducts: (products: Product[]) => void,
  categories: Category[],
  setCategories: (categories: Category[]) => void
  categoriesVisible: boolean,
  setCategoriesVisible: (visible: boolean) => void

  subCategories: SubCategory[],
  setSubCategories: (subCategories: SubCategory[]) => void

  ruletaVisible?: boolean,
  setRuletaVisible: (visible: boolean) => void
}

export const UIContext = createContext({} as UIContextInterface)