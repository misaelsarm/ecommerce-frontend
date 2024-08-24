import { SubCategory } from '@/interfaces/SubCategory';
import { Category, Product } from '../../interfaces';
import { UIState } from './UIProvider';
type UIActionType =
  {
    type: 'UI - Set Products',
    payload: Product[]
  }
  |
  {
    type: 'UI - Set Categories',
    payload: Category[]
  }
  |
  {
    type: 'UI - Set SubCategories',
    payload: SubCategory[]
  }
  |
  {
    type: 'UI - Set Visible',
    payload: boolean
  }
  |
  {
    type: 'UI - Set Ruleta Visible',
    payload: boolean
  }
  |
  {
    type: 'UI - Set Search Visible',
    payload: boolean
  }
  |
  {
    type: 'UI - Set Collections Visible',
    payload: boolean
  }
  |
  {
    type: 'UI - Set Modal Type',
    payload: string
  }

export const uiReducer = (state: UIState, action: UIActionType): UIState => {

  switch (action.type) {
    case 'UI - Set Products':
      return {
        ...state,
        products: action.payload
      }
    case 'UI - Set Categories':
      return {
        ...state,
        categories: action.payload
      }
    case 'UI - Set SubCategories':
      return {
        ...state,
        subCategories: action.payload
      }
    case 'UI - Set Visible':
      return {
        ...state,
        visible: action.payload
      }
    case 'UI - Set Ruleta Visible':
      return {
        ...state,
        ruletaVisible: action.payload
      }
    case 'UI - Set Search Visible':
      return {
        ...state,
        searchVisible: action.payload
      }
    case 'UI - Set Collections Visible':
      return {
        ...state,
        categoriesVisible: action.payload
      }
    case 'UI - Set Modal Type':
      return {
        ...state,
        modalType: action.payload
      }

    default:
      return state
  }
}