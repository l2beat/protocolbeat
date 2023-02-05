import { State } from '../State'
import { LEFT_MOUSE_BUTTON } from './constants'

export function onMouseMove(
  event: MouseEvent,
  state: State,
  container: HTMLElement,
  view: HTMLElement,
): State | undefined {
  if (!state.pressed.leftMouseButton && !state.pressed.middleMouseButton) {
    return
  }

  if (state.pressed.leftMouseButton && event.button === LEFT_MOUSE_BUTTON) {
    if (state.mouseMoveAction === 'none') {
      return { ...state, mouseUpAction: undefined }
    }
    if (state.mouseMoveAction === 'panning') {
      const [x, y] = [event.clientX, event.clientY]
      return {
        ...state,
        transform: {
          ...state.transform,
          offsetX: state.transform.offsetX + x - state.mouseMove.currentX,
          offsetY: state.transform.offsetY + y - state.mouseMove.currentY,
        },
        mouseMove: { ...state.mouseMove, currentX: x, currentY: y },
      }
    }
  }
}
