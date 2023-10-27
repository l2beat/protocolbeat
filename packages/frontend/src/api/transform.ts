import { ContractNode, ContractNode2, EOANode, SimpleNode } from './SimpleNode'
import { ContractParameters, ContractValue, ProjectParameters } from './types'
import { DiscoveryOutput, ContractParameters as ContractParameters2, ContractValue as ContractValue2 } from '@l2beat/discovery-types'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function transformContracts(discovery: ProjectParameters): SimpleNode[] {
  const contractNodes: ContractNode[] = discovery.contracts.map((contract) => {
    const { proxyFields, implementations } = getProxyDetails(contract)
    return {
      type: 'Contract',
      id: contract.address,
      name: emojifyContractName(contract),
      discovered: true,
      fields: [...proxyFields, ...mapFields(contract.values)].filter(
        (x) => !x.connection || !implementations.includes(x.connection),
      ),
      data: contract,
    }
  })

  const eoaNodes: EOANode[] = discovery.eoas.map((address) => ({
    type: 'EOA',
    id: address,
    name: `🧍 EOA ${address}`,
    discovered: true,
    fields: [],
    data: {
      address,
    },
  }))

  return [...contractNodes, ...eoaNodes]
}

export function transformContracts2(discovery: DiscoveryOutput): SimpleNode[] {
  const contractNodes: ContractNode2[] = discovery.contracts.map((contract) => {
    const { proxyFields, implementations } = getProxyDetails2(contract)
    return {
      type: 'Contract',
      id: contract.address.toString(),
      name: emojifyContractName2(contract),
      discovered: true,
      fields: [...proxyFields, ...mapFields(contract.values)].filter(
        (x) => !x.connection || !implementations.includes(x.connection),
      ),
      data: contract,
    }
  })

  const eoaNodes: EOANode[] = discovery.eoas.map((address) => ({
    type: 'EOA',
    id: address.toString(),
    name: `🧍 EOA ${address.toString()}`,
    discovered: true,
    fields: [],
    data: {
      address: address.toString(),
    },
  }))

  return [...contractNodes, ...eoaNodes]
}

interface FieldProps {
  name: string
  value?: string
  connection?: string
}

function mapFields(
  values: Record<string, ContractValue2> | ContractValue | undefined,
  prefix = '',
): FieldProps[] {
  if (values === undefined) {
    return []
  }
  return Object.entries(values).flatMap(
    ([key, value]: [string, ContractValue]): FieldProps[] => {
      if (typeof value === 'string' && isAddress(value)) {
        if (value === ZERO_ADDRESS) {
          return []
        }

        return [
          {
            name: concatKey(prefix, key),
            value,
            connection: value,
          },
        ]
      } else if (typeof value === 'object') {
        return mapFields(value, concatKey(prefix, key))
      }
      return []
    },
  )
}

function concatKey(prefix: string, key: string): string {
  return prefix
    ? /^\d+$/.test(key)
      ? `${prefix}[${key}]`
      : `${prefix}.${key}`
    : key
}

function isAddress(value: string): boolean {
  return (
    typeof value === 'string' && value.startsWith('0x') && value.length === 42
  )
}

function emojifyContractName(contract: ContractParameters): string {
  if (contract.name === 'GnosisSafe') {
    return '🔐 Gnosis Safe'
  }

  if (contract.upgradeability.type !== 'immutable') {
    return '🔗 ' + contract.name
  }

  return contract.name
}

function emojifyContractName2(contract: ContractParameters2): string {
  if (contract.name === 'GnosisSafe') {
    return '🔐 Gnosis Safe'
  }

  if (contract.upgradeability.type !== 'immutable') {
    return '🔗 ' + contract.name
  }

  return contract.name
}


function getProxyDetails(contract: ContractParameters): {
  proxyFields: FieldProps[]
  implementations: string[]
} {
  const proxyFields: FieldProps[] = []
  const implementations: string[] = []
  switch (contract.upgradeability.type) {
    case 'immutable':
      break
    case 'gnosis safe':
      implementations.push(contract.upgradeability.masterCopy)
      break
    case 'EIP1967 proxy':
      proxyFields.push({ name: 'admin', value: contract.upgradeability.admin })
      implementations.push(contract.upgradeability.implementation)
      break
    case 'ZeppelinOS proxy':
      if (contract.upgradeability.admin) {
        proxyFields.push({
          name: 'admin',
          value: contract.upgradeability.admin,
        })
      }
      implementations.push(contract.upgradeability.implementation)
      break
    case 'StarkWare proxy':
      implementations.push(contract.upgradeability.implementation)
      break
    case 'StarkWare diamond':
      implementations.push(
        contract.upgradeability.implementation,
        ...Object.values(contract.upgradeability.facets),
      )
      break
    case 'Arbitrum proxy':
    case 'new Arbitrum proxy':
      proxyFields.push({ name: 'admin', value: contract.upgradeability.admin })
      implementations.push(
        contract.upgradeability.userImplementation,
        contract.upgradeability.adminImplementation,
      )
      break
    case 'resolved delegate proxy':
      proxyFields.push({
        name: 'addressManager',
        value: contract.upgradeability.addressManager,
      })
      implementations.push(contract.upgradeability.implementation)
      break
    case 'EIP897 proxy':
      implementations.push(contract.upgradeability.implementation)
      break
    case 'call implementation proxy':
      implementations.push(contract.upgradeability.implementation)
      break
    case 'EIP2535 diamond proxy':
      implementations.push(...contract.upgradeability.facets)
      break
  }

  return {
    proxyFields: proxyFields.map((x) => ({
      ...x,
      name: `#️⃣ ${x.name}`,
      connection: x.value,
    })),
    implementations,
  }
}

function getProxyDetails2(contract: ContractParameters2): {
  proxyFields: FieldProps[]
  implementations: string[]
} {
  const proxyFields: FieldProps[] = []
  const implementations: string[] = []
  switch (contract.upgradeability.type) {
    case 'immutable':
      break
    case 'gnosis safe':
      implementations.push(contract.upgradeability.masterCopy.toString())
      break
    case 'EIP1967 proxy':
      proxyFields.push({ name: 'admin', value: contract.upgradeability.admin.toString() })
      implementations.push(contract.upgradeability.implementation.toString())
      break
    case 'ZeppelinOS proxy':
      if (contract.upgradeability.admin) {
        proxyFields.push({
          name: 'admin',
          value: contract.upgradeability.admin.toString(),
        })
      }
      implementations.push(contract.upgradeability.implementation.toString())
      break
    case 'StarkWare proxy':
      implementations.push(contract.upgradeability.implementation.toString())
      break
    case 'StarkWare diamond':
      implementations.push(
        contract.upgradeability.implementation.toString(),
        ...Object.values(contract.upgradeability.facets).map(f => f.toString()),
      )
      break
    case 'Arbitrum proxy':
    case 'new Arbitrum proxy':
      proxyFields.push({ name: 'admin', value: contract.upgradeability.admin.toString() })
      implementations.push(
        contract.upgradeability.userImplementation.toString(),
        contract.upgradeability.adminImplementation.toString(),
      )
      break
    case 'resolved delegate proxy':
      proxyFields.push({
        name: 'addressManager',
        value: contract.upgradeability.addressManager.toString(),
      })
      implementations.push(contract.upgradeability.implementation.toString())
      break
    case 'EIP897 proxy':
      implementations.push(contract.upgradeability.implementation.toString())
      break
    case 'call implementation proxy':
      implementations.push(contract.upgradeability.implementation.toString())
      break
    case 'EIP2535 diamond proxy':
      implementations.push(...contract.upgradeability.facets.map(f => f.toString()))
      break
  }

  return {
    proxyFields: proxyFields.map((x) => ({
      ...x,
      name: `#️⃣ ${x.name}`,
      connection: x.value,
    })),
    implementations,
  }
}
