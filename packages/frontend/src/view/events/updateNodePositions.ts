import { State } from '../State'

export function updateNodePositions(state: State) {
  let dx = state.mouseMove.currentX - state.mouseMove.startX
  let dy = state.mouseMove.currentY - state.mouseMove.startY
  if (state.pressed.shiftKey) {
    if (Math.abs(dx) > Math.abs(dy)) {
      dy = 0
    } else {
      dx = 0
    }
  }
  return {
    ...state,
    nodes: state.nodes.map((node) => {
      const start = state.selectedPositions[node.id]
      if (!start) {
        return node
      }
      return {
        ...node,
        box: { ...node.box, x: start.x + dx, y: start.y + dy },
      }
    }),
  }
}
