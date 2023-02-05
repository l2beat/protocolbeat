import { State } from '../State'
import { SHIFT_KEY, SPACE_KEY } from './constants'

export function onKeyUp(event: KeyboardEvent, state: State): State | undefined {
  if (event.key === SPACE_KEY) {
    return { ...state, pressed: { ...state.pressed, spaceKey: false } }
  }
  if (event.key === SHIFT_KEY) {
    return { ...state, pressed: { ...state.pressed, shiftKey: false } }
  }
}
