import classNames from 'classnames'
import { useRef } from 'react'

import { EXAMPLE_NODES } from './example'
import { State } from './State'
import { useViewportState } from './useViewportState'

const INITIAL_STATE: State = {
  selectedNodeIds: [],
  nodes: EXAMPLE_NODES,
  selection: undefined,
  transform: {
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  },
  pressed: {
    leftMouseButton: false,
    middleMouseButton: false,
    shiftKey: false,
  },
}

export function View() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)

  const state = useViewportState(INITIAL_STATE, containerRef, viewRef)

  const transform = `translate(${state.transform.offsetX}px, ${state.transform.offsetY}px) scale(${state.transform.scale})`

  return (
    <div className="p-16 w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full rounded-lg bg-white relative overflow-hidden"
      >
        <div
          ref={viewRef}
          className="w-full h-full bg-[url(/grid.svg)] bg-center relative select-none origin-[0_0]"
          style={{ transform }}
        >
          {state.nodes.map((node) => (
            <div
              key={node.id}
              style={{
                left: node.box.x,
                top: node.box.y,
                width: node.box.width,
                height: node.box.height,
              }}
              className={classNames(
                'absolute rounded-md border-2 border-black cursor-pointer bg-white',
                state.selectedNodeIds.includes(node.id) &&
                  'outline-indigo-300 outline outline-4',
              )}
            >
              <div
                className={classNames(
                  'w-full flex justify-between px-2 h-[28px] leading-[28px]',
                  node.fields.length > 0 && 'border-b-2 border-black',
                )}
              >
                <div className="truncate">{node.name}</div>
              </div>
              {node.fields.map((field, i) => (
                <div className="relative" key={i}>
                  <div className="w-full truncate px-2 h-[24px] leading-[24px]">
                    {field.name}
                  </div>
                  {field.connection && (
                    <div
                      className={classNames(
                        'absolute w-[12px] h-[12px]',
                        'bg-white border-2 border-black rounded-full',
                      )}
                      style={{
                        left:
                          field.connection.fromDirection === 'left'
                            ? -7
                            : undefined,
                        right:
                          field.connection.fromDirection === 'right'
                            ? -7
                            : undefined,
                        top: 6,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
