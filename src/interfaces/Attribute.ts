import { ValueInterface } from "."

export interface AttributeInterface {
  _id: string
  shortName: string,
  longName: string,
  type: {
    label: string,
    value: string
  }
  max: number,
  values: ValueInterface[],
  active: boolean
}