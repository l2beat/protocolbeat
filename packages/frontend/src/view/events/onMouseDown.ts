import { reverseIter } from '../reverseIter'
import { State } from '../State'
import { LEFT_MOUSE_BUTTON, MIDDLE_MOUSE_BUTTON } from './constants'

export function onMouseDown(
  event: MouseEvent,
  state: State,
  container: HTMLElement,
): State | undefined {
  const rect = container.getBoundingClientRect()
  const { offsetX, offsetY, scale } = state.transform

  if (event.button === LEFT_MOUSE_BUTTON && state.mouseAction === 'none') {
    const x = (event.clientX - rect.left - offsetX) / scale
    const y = (event.clientY - rect.top - offsetY) / scale

    for (const node of reverseIter(state.nodes)) {
      if (
        x >= node.box.x &&
        x < node.box.x + node.box.width &&
        y >= node.box.y &&
        y < node.box.y + node.box.height
      ) {
        const includes = state.selectedNodeIds.includes(node.id)

        let selectedNodeIds: readonly string[]
        let mouseUpAction: State['mouseUpAction']
        if (!event.shiftKey && !includes) {
          selectedNodeIds = [node.id]
        } else if (!event.shiftKey && includes) {
          selectedNodeIds = state.selectedNodeIds
          mouseUpAction = { type: 'DeselectAllBut', id: node.id }
        } else if (event.shiftKey && !includes) {
          selectedNodeIds = [...state.selectedNodeIds, node.id]
        } else {
          selectedNodeIds = state.selectedNodeIds
          mouseUpAction = { type: 'DeselectOne', id: node.id }
        }

        return {
          ...state,
          selectedNodeIds,
          pressed: { ...state.pressed, leftMouseButton: true },
          mouseAction: 'dragging',
          drag: {
            startX: x,
            startY: y,
            currentX: x,
            currentY: y,
            offsetX: x,
            offsetY: y,
          },
          mouseUpAction,
        }
      }
    }

    return {
      ...state,
      selectedNodeIds: [],
      pressed: { ...state.pressed, leftMouseButton: true },
      mouseAction: state.pressed.spaceKey ? 'dragging' : 'none',
      drag: {
        startX: x,
        startY: y,
        currentX: x,
        currentY: y,
        offsetX: x,
        offsetY: y,
      },
    }
  }

  if (event.button === MIDDLE_MOUSE_BUTTON && state.mouseAction === 'none') {
    return {
      ...state,
      pressed: { ...state.pressed, middleMouseButton: true },
      mouseAction: 'panning',
    }
  }
}
