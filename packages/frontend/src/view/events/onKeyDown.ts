import { State } from '../State'
import { SHIFT_KEY, SPACE_KEY } from './constants'

export function onKeyDown(
  event: KeyboardEvent,
  state: State,
): State | undefined {
  if (event.key === SPACE_KEY) {
    return { ...state, pressed: { ...state.pressed, spaceKey: true } }
  }
  if (event.key === SHIFT_KEY) {
    return { ...state, pressed: { ...state.pressed, shiftKey: true } }
  }
}
