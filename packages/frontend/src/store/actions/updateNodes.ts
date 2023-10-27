import { SimpleNode } from '../../api/SimpleNode'
import { Connection, Node, State } from '../State'
import { NODE_SPACING, NODE_WIDTH } from '../utils/constants'
import { updateNodePositions } from '../utils/updateNodePositions'
import { Graphviz as TGraphviz } from '@hpcc-js/wasm/types/graphviz'

function isAddress(value: string): boolean {
  return (
    typeof value === 'string' && value.startsWith('0x') && value.length === 42
  )
}

export function updateNodes(state: State, nodes: SimpleNode[], graphviz: TGraphviz | undefined): Partial<State> {
  const oldNodes = new Map(
    state.nodes.map((node) => [node.simpleNode.id, node]),
  )
  const newIds = new Set(nodes.map((node) => node.id))

  const retainedNodes = state.nodes.filter((node) =>
    newIds.has(node.simpleNode.id),
  )

  let placement: Record<string, {x: number, y: number}> | undefined = undefined
  if(graphviz) {
      const dotSrc = toGraphVizFormat(nodes)
      const plain = graphviz.dot(dotSrc, 'plain')
      console.log(dotSrc)
      console.log(plain)
      const ns = plain.split("\n").filter(l => l.startsWith("node"))
      placement = {}
      ns.forEach(n => { 
          const parts = n.split(" ")
          console.log(parts.slice(0, 6))
          placement[parts[1] ?? "null"] = {
              x: parseFloat(parts[2] ?? "0") * 96,
              y: -parseFloat(parts[3] ?? "0") * 96,
          }
      })
  }

  console.log(placement)

  const startX =
    retainedNodes.length === 0
      ? 0
      : Math.max(...retainedNodes.map((node) => node.box.x + node.box.width)) +
        NODE_SPACING

  const updatedNodes = nodes
    .filter((node) => oldNodes.has(node.id))
    .map((node) => {
      const oldNode = oldNodes.get(node.id)
      return simpleNodeToNode(node, oldNode?.box.x ?? 0, oldNode?.box.y ?? 0)
    })

    console.log(nodes.filter((node) => !oldNodes.has(node.id)))
  const addedNodes = nodes
    .filter((node) => !oldNodes.has(node.id))
    .map((node, i) =>
      simpleNodeToNode(node, 
                       placement ? placement[node.name.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').replaceAll(' ', '').trim()]?.x ?? 0 : startX + (NODE_WIDTH + NODE_SPACING) * i, 
                       placement ? placement[node.name.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').replaceAll(' ', '').trim()]?.y ?? 0 : 0),
    )

  return updateNodePositions({
    ...state,
    nodes: updatedNodes.concat(addedNodes),
  })
}

function simpleNodeToNode(node: SimpleNode, x: number, y: number): Node {
    console.log(node.name, x, y, node.name.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').replaceAll(' ', '').trim())
  return {
    simpleNode: node,
    // height will be updated by updateNodePositions
    box: { x, y, width: NODE_WIDTH, height: 0 },
    fields: node.fields.map((field) => ({
      name: field.name,
      connection: toConnection(field.connection),
    })),
  }
}

export function nodeToSimpleNode(node: Node): SimpleNode {
  return node.simpleNode
}

function toConnection(nodeId: string | undefined): Connection | undefined {
  if (nodeId === undefined) {
    return
  }
  return {
    nodeId,
    // fields below will be updated by updateNodePositions
    from: { direction: 'left', x: 0, y: 0 },
    to: { direction: 'left', x: 0, y: 0 },
  }
}

function toGraphVizFormat(nodes: SimpleNode[]): string {
    const addressMap: Record<string, string> = {}
    nodes.forEach(n => { if('data' in n && 'name' in n.data) { addressMap[n.data.address.toString()] = n.data.name } })

    let dotSrc = "strict graph {\n"
    dotSrc += "node [shape=record];\n"

    nodes.forEach(n => {
        if('data' in n && 'name' in n.data) {
            let label = `${n.data.name}`
            if(n.data.values) {
                label += `${Object.entries(n.data.values).filter(([_, value]) => isAddress(value as string)).map(([fieldName, _]) => fieldName).join("|")}`
            }

            dotSrc += `${n.data.name} [label="{${label}}",width=2];\n`
        }
    })

    nodes.forEach(n => {
        if('data' in n && 'name' in n.data && n.data.values) {
            const addresses = Object
            .entries(n.data.values)
            .filter(([_, value]) => typeof value === 'string' && isAddress(value))
            .map(([_, address]) => address.toString())

            addresses.forEach(a => {
                if(addressMap[a] && 'name' in n.data) {
                    dotSrc += `${n.data.name} -- ${addressMap[a]};\n` 
                }
            })
        }
    })

    dotSrc += "}\n"

    return dotSrc
}
