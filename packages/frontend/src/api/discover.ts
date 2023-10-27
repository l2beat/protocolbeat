import { SimpleNode } from './SimpleNode'
import { transformContracts } from './transform'
import { ProjectParameters } from './types'

export async function discover(
  address: string,
  maxDepth = 0,
): Promise<SimpleNode[]> {
  console.log('Loading: ', address)

  // const res = await fetch(`/api/discover/${address}?maxDepth=${maxDepth}`)
  const res = await fetch(`https://protocolbeat-frontend.vercel.app/api/discover/${address}?maxDepth=0`)
  if (!res.ok) {
    return []
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const discovery = (await res.json()) as ProjectParameters
  return transformContracts(discovery)
}
