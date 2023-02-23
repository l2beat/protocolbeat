import { SimpleNode } from '../../api/SimpleNode'
import { Connection, Node, State } from '../State'
import { NODE_SPACING, NODE_WIDTH } from '../utils/constants'
import { updateNodePositions } from '../utils/updateNodePositions'

export function updateNodes(state: State, nodes: SimpleNode[]): Partial<State> {
  const oldNodes = new Map(state.nodes.map((node) => [node.id, node]))
  const newIds = new Set(nodes.map((node) => node.id))

  const retainedNodes = state.nodes.filter((node) => newIds.has(node.id))

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

  const addedNodes = nodes
    .filter((node) => !oldNodes.has(node.id))
    .map((node, i) =>
      simpleNodeToNode(node, startX + (NODE_WIDTH + NODE_SPACING) * i, 0),
    )

  return updateNodePositions({
    ...state,
    nodes: updatedNodes.concat(addedNodes),
  })
}

function simpleNodeToNode(node: SimpleNode, x: number, y: number): Node {
  return {
    type: node.type,
    data: (node as any).data,
    id: node.id,
    name: node.name,
    discovered: node.discovered,
    // height will be updated by updateNodePositions
    box: { x, y, width: NODE_WIDTH, height: 0 },
    fields: node.fields.map((field) => ({
      name: field.name,
      connection: toConnection(field.connection),
    })),
  }
}

export function nodeToSimpleNode(node: Node): SimpleNode {
  return {
    type: node.type,
    data: (node as any).data,
    id: node.id,
    name: node.name,
    discovered: node.discovered,
    fields: node.fields.map((field) => ({
      name: field.name,
      connection: field.connection?.nodeId,
    })),
  }
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
