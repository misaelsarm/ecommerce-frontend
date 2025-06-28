import { AttributeType } from "@/utils/types"
import { ValueInterface } from "."

export interface AttributeInterface {
  _id: string
  shortName: string,
  longName: string,
  type: AttributeType
  max: number,
  values: ValueInterface[],
  active: boolean
}