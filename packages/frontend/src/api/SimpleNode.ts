import { ContractParameters } from './types'
import { DiscoveryOutput, ContractParameters as ContractParameters2, ContractValue as ContractValue2 } from '@l2beat/discovery-types'

interface SimpleNodeShared {
  id: string
  name: string
  discovered: boolean
  fields: {
    name: string
    connection?: string // id
  }[]
}

export interface ContractNode extends SimpleNodeShared {
  type: 'Contract'
  data: ContractParameters
}

export interface ContractNode2 extends SimpleNodeShared {
  type: 'Contract'
  data: ContractParameters2
}

export interface EOANode extends SimpleNodeShared {
  type: 'EOA'
  data: {
    address: string
  }
}
export interface UnknownNode extends SimpleNodeShared {
  type: 'Unknown'
}

export type SimpleNode = ContractNode | EOANode | UnknownNode | ContractNode2
