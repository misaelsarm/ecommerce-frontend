import { FC, useEffect, useReducer } from "react";
import { UIContext } from "./UIContext";
import { uiReducer } from "./uiReducer";
import { makeRequest } from "@/utils/makeRequest";
import { CollectionInterface, ProductInterface } from "@/interfaces";
export interface UIState {
  visible: boolean,
  modalType: string,
  products: ProductInterface[],
  searchVisible: boolean,
  //categoriesVisible: boolean,
  collections: CollectionInterface[]
}

interface Props {
  children: JSX.Element
}

const UI_INITIAL_STATE: UIState = {
  visible: false,
  modalType: '',
  products: [],
  searchVisible: false,
  collections: []
  //categoriesVisible: false,
}

export const UIProvider: FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

  const setProducts = (products: ProductInterface[]) => {
    dispatch({ type: 'UI - Set Products', payload: products })
  }

  const setCollections = (collections: CollectionInterface[]) => {
    dispatch({ type: 'UI - Set Collections', payload: collections })
  }

  const setVisible = (visible: boolean) => {
    dispatch({ type: 'UI - Set Visible', payload: visible })
  }

  const setSearchVisible = (visible: boolean) => {
    dispatch({ type: 'UI - Set Search Visible', payload: visible })
  }

/*   const setCategoriesVisible = (visible: boolean) => {
    dispatch({ type: 'UI - Set Collections Visible', payload: visible })
  }
 */
  const setModalType = (modalType: string) => {
    dispatch({ type: 'UI - Set Modal Type', payload: modalType })
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await makeRequest('get', '/api/products?active=true')
      /*  const { data: categoriesData } = await makeRequest('get', '/api/categories?active=true')
       const { data: subCategoriesData } = await makeRequest('get', '/api/subcategories?active=true') */

      //setSubCategories(subCategoriesData.subcategories)
      setProducts(data.products)
      // setCategories(categoriesData.categories)
    }
    fetchData()
  }, [])

  return (
    <UIContext.Provider
      value={{
        ...state,
        setProducts,
        setCollections,
        //setCategories,
        //setSubCategories,
        //setCategoriesVisible,
        setVisible,
        setSearchVisible,
        setModalType,

      }}>
      {
        children
      }
    </UIContext.Provider>
  )

}