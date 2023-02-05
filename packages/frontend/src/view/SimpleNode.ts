export interface SimpleNode {
  id: string
  name: string
  fields: {
    name: string
    connection?: string
  }[]
}
