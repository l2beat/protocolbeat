import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

import { Node } from '../store/State'

interface D3LayoutProps {
  nodes: readonly Node[]
}

export function D3Layout({ nodes }: D3LayoutProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  const draw = () => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const links = nodes
      .map((n) => n.simpleNode)
      .flatMap((n) => n.fields.map((f) => ({ source: n.id, target: f.connection, value: 1 })))
      .filter((l) => l.target !== undefined)

    svg
      .selectAll('.edge')
      .data(links)
      .enter()
      .append('line')
      .classed('edge', true)
      .attr('stroke', 'black')
      .attr('x1', (d) => nodes.find((n) => n.simpleNode.id === d.source).box.x / 10)
      .attr('y1', (d) => nodes.find((n) => n.simpleNode.id === d.source).box.y / 10)
      .attr('x2', (d) => nodes.find((n) => n.simpleNode.id === d.target).box.x / 10)
      .attr('y2', (d) => nodes.find((n) => n.simpleNode.id === d.target).box.y / 10)

    svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('rect')
      .classed('node', true)
      .attr('width', 10)
      .attr('height', (d) => 2 + d.fields.length)
      .attr('x', (d) => d.box.x / 10)
      .attr('y', (d) => d.box.y / 10)
      .attr('fill', 'red')

  }

  useEffect(() => {
    draw()
  }, [nodes])

  return (
    <div
      className="absolute border-2 border-black bg-white"
      style={{ left: '100px', top: '100px', width: '400px', height: '400px' }}
    >
      Hello sir!
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  )
}
