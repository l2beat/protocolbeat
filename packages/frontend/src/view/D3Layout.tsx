import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

import { Node } from '../store/State'
import { useStore } from '../store/store'

interface D3LayoutProps {
  nodes: readonly Node[]
}

export function D3Layout({ nodes }: D3LayoutProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const moveNodes = useStore((state) => state.moveNodes)

  const draw = () => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const simNodes = nodes.map((node) => ({
      id: node.simpleNode.id,
      // x: node.box.x / 10,
      // y: node.box.y / 10,
      node,
    }))

    const links = nodes
      .map((n) => n.simpleNode)
      .flatMap((n) =>
        n.fields.map((f) => ({ source: n.id, target: f.connection, value: 1 })),
      )
      .filter((l) => l.target !== undefined)

    const link = svg
      .selectAll('.edge')
      .data(links)
      .join('line')
      .classed('edge', true)
      .attr('stroke', 'gray')
    // .attr('x1', (d) => simNodes.find((n) => n.id === d.source).x / 10)
    // .attr('y1', (d) => simNodes.find((n) => n.id === d.source).y / 10)
    // .attr('x2', (d) => simNodes.find((n) => n.id === d.target).x / 10)
    // .attr('y2', (d) => simNodes.find((n) => n.id === d.target).y / 10)

    const node = svg
      .selectAll('.node')
      .data(simNodes)
      .join('rect')
      .classed('node', true)
      .attr('width', 10)
      .attr('height', (d) => 2 + d.node.fields.length)
      .attr('x', (d) => d.x / 10)
      .attr('y', (d) => d.y / 10)
      .attr('fill', 'red')

    // Create a simulation with several forces.
    const simulation = d3
      .forceSimulation(simNodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(20),
      )
      .force('charge', d3.forceManyBody().strength(-5))
      //     // .force("center", d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(20))
      .force('center', d3.forceCenter(200, 0))
      .on('tick', ticked)
      .on('end', ended)

    // Set the position attributes of links and nodes each time the simulation ticks.
    function ticked() {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)

      node.attr('x', (d) => d.x).attr('y', (d) => d.y)
      moveNodes(simNodes)
    }

    function ended() {
      console.log('Layout force simulation ended')
      moveNodes(simNodes)
    }

    // TODO: stop simulation if it's running (and on invalidation of this component)
  }

  useEffect(() => {
    draw()
  }, [])

  return (
    <div
      className="absolute border-2 border-black bg-white"
      style={{ left: '100px', top: '100px', width: '400px', height: '400px' }}
    >
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  )
}
