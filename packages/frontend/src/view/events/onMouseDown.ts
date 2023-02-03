import { reverseIter } from '../reverseIter'
import { State } from '../State'

const LEFT_MOUSE_BUTTON = 0
const MIDDLE_MOUSE_BUTTON = 1

export function onMouseDown(
  e: MouseEvent,
  state: State,
  container: HTMLElement,
): State | undefined {
  const rect = container.getBoundingClientRect()
  const { offsetX, offsetY, scale } = state.transform

  if (e.button === LEFT_MOUSE_BUTTON) {
    const x = (e.clientX - rect.left - offsetX) / scale
    const y = (e.clientY - rect.top - offsetY) / scale

    for (const node of reverseIter(state.nodes)) {
      if (
        x >= node.box.x &&
        x < node.box.x + node.box.width &&
        y >= node.box.y &&
        y < node.box.y + node.box.height
      ) {
        if (e.shiftKey) {
          const selectedNodeIds = state.selectedNodeIds.includes(node.id)
            ? state.selectedNodeIds.filter((x) => x !== node.id)
            : [...state.selectedNodeIds, node.id]
          return {
            ...state,
            selectedNodeIds,
            pressed: { ...state.pressed, leftMouseButton: true },
          }
        }
        return {
          ...state,
          selectedNodeIds: [node.id],
          pressed: { ...state.pressed, leftMouseButton: true },
        }
      }
    }

    return {
      ...state,
      selectedNodeIds: [],
      pressed: { ...state.pressed, leftMouseButton: true },
    }
  }

  if (e.button === MIDDLE_MOUSE_BUTTON) {
    return {
      ...state,
      pressed: { ...state.pressed, middleMouseButton: true },
    }
  }
}
