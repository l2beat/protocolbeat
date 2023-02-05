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
    if (state.mouseUpAction) {
      return {
        ...state,
        mouseUpAction: undefined,
      }
    }
    console.log(event)
  }
}
