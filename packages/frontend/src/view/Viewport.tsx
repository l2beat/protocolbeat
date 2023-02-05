import { useRef } from 'react'

import { Connection } from './Connection'
import { NodeView } from './NodeView'
import { useViewportState } from './utils/useViewportState'

export interface ViewportProps {
  nodes: {
    id: string
    name: string
    onDiscover?: () => void
    fields: {
      name: string
      connection?: string
    }[]
  }[]
}

export function Viewport(props: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)

  const state = useViewportState(props.nodes, containerRef, viewRef)

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
          {state.nodes.map((node) =>
            node.fields.map(
              (field) =>
                field.connection && (
                  <Connection
                    key={`${node.id}-${field.connection.nodeId}`}
                    from={field.connection.from}
                    to={field.connection.to}
                  />
                ),
            ),
          )}
          {state.nodes.map((node) => (
            <NodeView
              key={node.id}
              node={node}
              selected={state.selectedNodeIds.includes(node.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
