import { BORDER_WIDTH, FIELD_HEIGHT, HEADER_HEIGHT } from './constants'
import { Box, Connection, State } from './State'

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

  const nodeDimensions: Record<string, Box> = {}
  for (const node of state.nodes) {
    const start = state.selectedPositions[node.id]
    nodeDimensions[node.id] = {
      width: node.box.width,
      height:
        HEADER_HEIGHT + node.fields.length * FIELD_HEIGHT + BORDER_WIDTH * 2,
      x: start ? start.x + dx : node.box.x,
      y: start ? start.y + dy : node.box.y,
    }
  }

  return {
    ...state,
    nodes: state.nodes.map((node) => {
      const box = nodeDimensions[node.id]
      if (!box) {
        // this should never happen
        throw new Error('missing dimensions for node ' + node.id)
      }
      return {
        ...node,
        box,
        fields: node.fields.map((field, index) => {
          if (!field.connection) {
            return field
          }
          const to = nodeDimensions[field.connection.nodeId]
          if (!to) {
            return { ...field, connection: undefined }
          }
          return {
            ...field,
            connection: {
              nodeId: field.connection.nodeId,
              ...processConnection(index, box, to),
            },
          }
        }),
      }
    }),
  }
}

function processConnection(
  index: number,
  from: { x: number; y: number; width: number },
  to: { x: number; y: number; width: number },
): Omit<Connection, 'nodeId'> {
  const y = from.y + HEADER_HEIGHT + FIELD_HEIGHT * (index + 0.5)

  const left = from.x - BORDER_WIDTH / 2
  const right = from.x + from.width - BORDER_WIDTH * 1.5

  const leftToLeft = Math.abs(to.x - left)
  const leftToRight = Math.abs(to.x + to.width - left)
  const rightToLeft = Math.abs(to.x - right)
  const rightToRight = Math.abs(to.x + to.width - right)

  const min = Math.min(leftToLeft, leftToRight, rightToLeft, rightToRight)

  if (min === leftToLeft) {
    return {
      from: { direction: 'left', x: from.x, y },
      to: { direction: 'left', x: to.x, y: to.y },
    }
  } else if (min === leftToRight) {
    return {
      from: { direction: 'left', x: from.x, y },
      to: { direction: 'right', x: to.x + to.width, y: to.y },
    }
  } else if (min === rightToLeft) {
    return {
      from: { direction: 'right', x: from.x + from.width, y },
      to: { direction: 'left', x: to.x, y: to.y },
    }
  } else if (min === rightToRight) {
    return {
      from: { direction: 'right', x: from.x + from.width, y },
      to: { direction: 'right', x: to.x + to.width, y: to.y },
    }
  }

  throw new Error('impossible min result')
}
