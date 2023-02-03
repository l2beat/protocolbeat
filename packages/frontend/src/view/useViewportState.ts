import { RefObject, useEffect, useRef, useState } from 'react'

import { onMouseDown } from './events/onMouseDown'
import { onWheel } from './events/onWheel'
import { State } from './State'

export function useViewportState(
  initialState: State,
  containerRef: RefObject<HTMLElement>,
  viewRef: RefObject<HTMLElement>,
) {
  const [state, setState] = useState(initialState)
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      if (!viewRef.current) {
        return
      }
      const newState = onWheel(e, stateRef.current, viewRef.current)
      setState(newState)
    }

    function handleMouseDown(e: MouseEvent) {
      if (!containerRef.current) {
        return
      }
      const newState = onMouseDown(e, stateRef.current, containerRef.current)
      if (newState) {
        setState(newState)
      }
    }

    containerRef.current?.addEventListener('wheel', handleWheel, {
      passive: false,
    })
    containerRef.current?.addEventListener('mousedown', handleMouseDown, {
      passive: false,
    })
    return () => {
      containerRef.current?.removeEventListener('wheel', handleWheel)
      containerRef.current?.removeEventListener('mousedown', handleMouseDown)
    }
  }, [setState])

  return state
}
