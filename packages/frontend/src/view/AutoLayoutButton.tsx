import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3'
import { useEffect, useState } from 'react'

import { Node } from '../store/State'
import { useStore } from '../store/store'

const SIM_SCALE = 10

interface D3LayoutProps {
  nodes: readonly Node[]
}

export function AutoLayoutButton({ nodes }: D3LayoutProps) {
  const moveNodes = useStore((state) => state.moveNodes)
  const [updatingLayout, setUpdatingLayout] = useState<boolean>(false)

  const draw = () => {
    if (!updatingLayout) return

    const simNodes = nodes.map((node) => ({
      id: node.simpleNode.id,
      x: node.box.x / SIM_SCALE,
      y: node.box.y / SIM_SCALE,
      fixed: true,
      node,
    }))

    const links = nodes
      .map((n) => n.simpleNode)
      .flatMap((n) =>
        n.fields.map((f) => ({
          source: n.id,
          target: f.connection,
        })),
      )
      .filter((l) => l.target !== undefined)

    forceSimulation(simNodes)
      .force(
        'link',
        forceLink(links).id((d) => d.id as string),
      )
      .force('charge', forceManyBody())
      .force('center', forceCenter(0, 0))
      .on('tick', ticked)
      .on('end', ended)

    function ticked() {
      moveNodes(
        simNodes.map((simNode) => ({
          ...simNode,
          x: simNode.x * SIM_SCALE,
          y: simNode.y * SIM_SCALE,
        })),
      )
    }

    function ended() {
      setUpdatingLayout(false)
    }

    // TODO: stop simulation if it's running (and on invalidation of this component)
  }

  useEffect(() => {
    draw()
  }, [updatingLayout])

  console.log('Updating layout', updatingLayout)
  return (
    <button
      className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
      type="button"
      disabled={updatingLayout}
      onClick={() => setUpdatingLayout(true)}
    >
      {updatingLayout ? 'wait...' : 'Auto-layout'}
    </button>
  )
}
