import { ValueType } from "@/utils/types"

export interface ValueInterface {
  _id: string
  label: string,
  value: string,
  type: ValueType,
  active: boolean
}