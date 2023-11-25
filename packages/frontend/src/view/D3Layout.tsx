import * as d3 from 'd3'
import { useEffect } from 'react'

import { Node } from '../store/State'
import { useStore } from '../store/store'

const SIM_SCALE = 10

interface D3LayoutProps {
  nodes: readonly Node[]
}

export function D3Layout({ nodes }: D3LayoutProps) {
  const moveNodes = useStore((state) => state.moveNodes)

  const draw = () => {
    const simNodes = nodes.map((node, i) => ({
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

    const simulation = d3
      .forceSimulation(simNodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => d.id)
          // .distance(20),
      )
      .force('charge', d3.forceManyBody())//.strength(-15))
      // .force('collide', d3.forceCollide(20))
      .force('center', d3.forceCenter(0, 0))
      // .force("radial", d3.forceRadial(d => Math.sqrt(d.x * d.x + d.y * d.y) * 5.5, 0, 0))
      // .force('x', d3.forceX(1000).strength(0.01))
      // .force('y', d3.forceY(0))
      // .force("rightPush", rightPushForce(12.5))
      .on('tick', ticked)
      .on('end', ended)

    // Custom force to push linked nodes to the right
    // function rightPushForce(strength) {
    //   function force(alpha) {
    //       links.forEach(link => {
    //         if (link.source.x > link.target.x) {
    //           link.target.x += strength * alpha;
    //           link.source.x -= strength * alpha;
    //         }
    //       });
    //   }
    //   return force;
    // }

    // Set the position attributes of links and nodes each time the simulation ticks.
    function ticked() {
      moveNodes(
        simNodes.map((n) => ({ ...n, x: n.x * SIM_SCALE, y: n.y * SIM_SCALE })),
      )
    }

    function ended() {
      console.log('Layout force simulation ended')
    }

    // TODO: stop simulation if it's running (and on invalidation of this component)
  }

  useEffect(() => {
    draw()
  }, [])

  return <></>
}
