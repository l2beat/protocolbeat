import { State } from '../State'
import { updateNodePositions } from '../utils/updateNodePositions'

export function moveNodes(
  state: State,
  positions: { id: string; x: number; y: number }[],
): Partial<State> {
  const nodes = state.nodes.map((node) => {
    const position = positions.find(
      (position) => position.id === node.simpleNode.id,
    )
    if (!position) {
      return node
    }
    return {
      ...node,
      box: {
        ...node.box,
        x: position.x,
        y: position.y,
      },
    }
  })

  return updateNodePositions({
    ...state,
    nodes,
  })
}
