import { State } from '../State'

const ZOOM_SENSITIVITY = 0.02
const MAX_ZOOM = 3
const MIN_ZOOM = 0.3

export function onWheel(e: WheelEvent, state: State, view: HTMLElement): State {
  e.preventDefault()
  const { deltaX, deltaY } = getWheelDelta(e)
  const { offsetX, offsetY, scale } = state.transform

  if (e.ctrlKey || e.metaKey) {
    const rect = view.getBoundingClientRect()

    const desiredChange = -deltaY * ZOOM_SENSITIVITY
    let newScale = scale * (1 + desiredChange)
    newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale))
    const change = newScale / scale - 1

    return {
      ...state,
      transform: {
        offsetX: offsetX + (rect.left - e.clientX) * change,
        offsetY: offsetY + (rect.top - e.clientY) * change,
        scale: scale * (1 + change),
      },
    }
  } else {
    const invert = e.shiftKey // TODO: shiftKey && !macos
    return {
      ...state,
      transform: {
        offsetX: offsetX - (!invert ? e.deltaX : deltaY),
        offsetY: offsetY - (!invert ? e.deltaY : deltaX),
        scale,
      },
    }
  }
}

// facebook's defaults
const LINE_HEIGHT = 40
const PAGE_HEIGHT = 800

function getWheelDelta(event: WheelEvent) {
  let pixelsPerUnit = 1
  if (event.deltaMode === 1) {
    // lines scrolled
    pixelsPerUnit = LINE_HEIGHT
  }
  if (event.deltaMode === 2) {
    // pages scrolled
    pixelsPerUnit = PAGE_HEIGHT
  }

  return {
    deltaX: event.deltaX * pixelsPerUnit,
    deltaY: event.deltaY * pixelsPerUnit,
  }
}
