import { SubCategory } from "@/interfaces/SubCategory";
import { FC, useEffect, useReducer } from "react";
import { api } from "../../api_config/api";
import { Category, Product } from "../../interfaces";
import { UIContext } from "./UIContext";
import { uiReducer } from "./uiReducer";
export interface UIState {
  visible: boolean,
  modalType: string,
  products: Product[],
  searchVisible: boolean,
  categoriesVisible: boolean,
  categories: Category[]
  subCategories: SubCategory[],
  ruletaVisible: boolean
}

interface Props {
  children: JSX.Element
}

const UI_INITIAL_STATE: UIState = {
  visible: false,
  modalType: '',
  products: [],
  searchVisible: false,
  categoriesVisible: false,
  categories: [],
  subCategories: [],
  ruletaVisible: false
}

export const UIProvider: FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

  const setProducts = (products: Product[]) => {
    dispatch({ type: 'UI - Set Products', payload: products })
  }

  const setCategories = (categories: Category[]) => {
    dispatch({ type: 'UI - Set Categories', payload: categories })
  }

  const setSubCategories = (subCategories: SubCategory[]) => {
    dispatch({ type: 'UI - Set SubCategories', payload: subCategories })
  }

  const setVisible = (visible: boolean) => {
    dispatch({ type: 'UI - Set Visible', payload: visible })
  }

  const setRuletaVisible = (visible: boolean) => {
    dispatch({ type: 'UI - Set Ruleta Visible', payload: visible })
  }

  const setSearchVisible = (visible: boolean) => {
    dispatch({ type: 'UI - Set Search Visible', payload: visible })
  }

  const setCategoriesVisible = (visible: boolean) => {
    dispatch({ type: 'UI - Set Collections Visible', payload: visible })
  }

  const setModalType = (modalType: string) => {
    dispatch({ type: 'UI - Set Modal Type', payload: modalType })
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get('/api/products?active=true')
      const { data: categoriesData } = await api.get('/api/categories?active=true')
      const { data: subCategoriesData } = await api.get('/api/subcategories?active=true')

      console.log({subCategoriesData})

      setSubCategories(subCategoriesData.subcategories)
      setProducts(data.products)
      setCategories(categoriesData.categories)
    }
    fetchData()
  }, [])

  return (
    <UIContext.Provider
      value={{
        ...state,
        setProducts,
        setCategories,
        setVisible,
        setSearchVisible,
        setModalType,
        setCategoriesVisible,
        setSubCategories,
        setRuletaVisible
      }}>
      {
        children
      }
    </UIContext.Provider>
  )

}