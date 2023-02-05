import { FieldProps, NodeProps } from './old/Nodes'
import { ContractParameters, ContractValue, ProjectParameters } from './types'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function transformContracts(discovery: ProjectParameters): NodeProps[] {
  return discovery.contracts
    .map((contract) => {
      const { proxyFields, implementations } = getProxyDetails(contract)
      return {
        id: contract.address,
        name: emojifyContractName(contract),
        fields: [...proxyFields, ...mapFields(contract.values)]
          .filter(
            (x) => !x.connection || !implementations.includes(x.connection),
          )
          .map((field) => ({
            ...field,
            value: field.value === ZERO_ADDRESS ? '∅' : field.value,
            connection:
              field.connection !== ZERO_ADDRESS ? field.connection : undefined,
          })),
        data: contract as unknown,
      }
    })
    .concat(
      discovery.eoas.map((address) => ({
        id: address,
        name: `🧍 EOA ${address}`,
        fields: [],
        data: 'EOA',
      })),
    )
}

export function createEmptyNodes(
  nodes: NodeProps[],
  discoverContract: (a: string) => Promise<void>,
): NodeProps[] {
  const unknownIds = new Set<string>()
  const knownIds = new Set(nodes.map((contract) => contract.id))

  for (const node of nodes) {
    for (const field of node.fields) {
      if (field.connection && !knownIds.has(field.connection)) {
        unknownIds.add(field.connection)
      }
    }
  }

  return [...unknownIds].map((id) => ({
    id,
    name: 'Unknown',
    fields: [],
    onDiscover: () => discoverContract(id),
  }))
}

function mapFields(
  values: ContractValue | undefined,
  prefix = '',
): FieldProps[] {
  if (values === undefined) {
    return []
  }
  return Object.entries(values).flatMap(
    ([key, value]: [string, ContractValue]): FieldProps[] => {
      if (typeof value === 'string' && isAddress(value)) {
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
