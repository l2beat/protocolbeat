import classNames from 'classnames'

import { Node } from './State'

export interface NodeViewProps {
  node: Node
  selected: boolean
}

export function NodeView({ node, selected }: NodeViewProps) {
  return (
    <div
      style={{
        left: node.box.x,
        top: node.box.y,
        width: node.box.width,
        height: node.box.height,
      }}
      className={classNames(
        'absolute rounded-md border-2 border-black cursor-pointer bg-white',
        selected && 'outline-indigo-300 outline outline-4',
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
                  field.connection.from.direction === 'left' ? -7 : undefined,
                right:
                  field.connection.from.direction === 'right' ? -7 : undefined,
                top: 6,
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
