export interface CollectionInterface {
  name: string,
  code: string,
  description: string,
  image: string,
  active: boolean,
  keywords: string,
  parentCollection?: CollectionInterface
}