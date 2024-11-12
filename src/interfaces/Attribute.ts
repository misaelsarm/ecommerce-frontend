import { ValueInterface } from "."

// Define a separate type for the attribute type
export type AttributeType = 'dropdown' | 'color' | 'short-text' | 'long-text'

export interface AttributeInterface {
  _id: string
  shortName: string,
  longName: string,
  type: AttributeType
  max: number,
  values: ValueInterface[],
  active: boolean
}