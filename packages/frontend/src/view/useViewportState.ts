import { MutableRefObject, RefObject, useEffect, useRef, useState } from 'react'

import { NODE_SPACING, NODE_WIDTH } from './constants'
import { onKeyDown } from './events/onKeyDown'
import { onKeyUp } from './events/onKeyUp'
import { onMouseDown } from './events/onMouseDown'
import { onMouseMove } from './events/onMouseMove'
import { onMouseUp } from './events/onMouseUp'
import { onWheel } from './events/onWheel'
import { INITIAL_STATE, Node, State } from './State'
import { updateNodePositions } from './updateNodePositions'

export interface SimpleNode {
  id: string
  name: string
  fields: {
    name: string
    connection?: string
  }[]
}

export function useViewportState(
  nodes: SimpleNode[],
  containerRef: RefObject<HTMLElement>,
  viewRef: RefObject<HTMLElement>,
) {
  const [state, setState] = useState(INITIAL_STATE)
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    setState((state) => updateNodes(state, nodes))
  }, [nodes, setState])

  useEffect(() => {
    return setupEventListeners(stateRef, setState, viewRef, containerRef)
  }, [setState])

  return state
}

function updateNodes(state: State, nodes: SimpleNode[]): State {
  const oldNodes = new Map(state.nodes.map((node) => [node.id, node]))
  const newNodes = new Map(nodes.map((node) => [node.id, node]))

  const retainedNodes = state.nodes.filter((node) => newNodes.has(node.id))

  const startX =
    retainedNodes.length === 0
      ? 0
      : Math.max(...retainedNodes.map((node) => node.box.x + node.box.width)) +
        NODE_SPACING

  const addedNodes = nodes
    .filter((node) => !oldNodes.has(node.id))
    .map(
      (node, i): Node => ({
        id: node.id,
        name: node.name,
        box: {
          x: startX + (NODE_WIDTH + NODE_SPACING) * i,
          y: 0,
          width: NODE_WIDTH,
          // will be updated by updateNodePositions
          height: 0,
        },
        fields: node.fields.map((field) => ({
          name: field.name,
          connection: field.connection
            ? {
                nodeId: field.connection,
                // fields below will be updated by updateNodePositions
                fromDirection: 'left',
                toDirection: 'left',
                toX: 0,
                toY: 0,
              }
            : undefined,
        })),
      }),
    )

  return updateNodePositions({
    ...state,
    nodes: retainedNodes.concat(addedNodes),
  })
}

function setupEventListeners(
  stateRef: MutableRefObject<State>,
  setState: (state: State) => void,
  viewRef: RefObject<HTMLElement>,
  containerRef: RefObject<HTMLElement>,
) {
  function handleWheel(event: WheelEvent) {
    if (!viewRef.current) return
    const newState = onWheel(event, stateRef.current, viewRef.current)
    setState(newState)
  }

  function handleMouseDown(event: MouseEvent) {
    if (!containerRef.current) return
    const newState = onMouseDown(event, stateRef.current, containerRef.current)
    newState && setState(newState)
  }

  function handleMouseMove(event: MouseEvent) {
    if (!containerRef.current) return
    const newState = onMouseMove(event, stateRef.current, containerRef.current)
    newState && setState(newState)
  }

  function handleMouseUp(event: MouseEvent) {
    const newState = onMouseUp(event, stateRef.current)
    newState && setState(newState)
  }

  function handleKeyDown(event: KeyboardEvent) {
    const newState = onKeyDown(event, stateRef.current)
    newState && setState(newState)
  }

  function handleKeyUp(event: KeyboardEvent) {
    const newState = onKeyUp(event, stateRef.current)
    newState && setState(newState)
  }

  const target = containerRef.current
  target?.addEventListener('wheel', handleWheel, { passive: false })
  target?.addEventListener('mousedown', handleMouseDown, { passive: false })
  window.addEventListener('mousemove', handleMouseMove, { passive: false })
  window.addEventListener('mouseup', handleMouseUp, { passive: false })
  window.addEventListener('keydown', handleKeyDown, { passive: false })
  window.addEventListener('keyup', handleKeyUp, { passive: false })
  return () => {
    target?.removeEventListener('wheel', handleWheel)
    target?.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  }
}
