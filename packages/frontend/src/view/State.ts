export interface State {
  readonly selectedNodeIds: readonly string[]
  readonly nodes: readonly Node[]
  readonly selection?: Box
  readonly transform: {
    readonly offsetX: number
    readonly offsetY: number
    readonly scale: number
  }
  readonly pressed: {
    readonly leftMouseButton: boolean
    readonly middleMouseButton: boolean
    readonly shiftKey: boolean
    readonly spaceKey: boolean
  }
  readonly mouseAction: 'dragging' | 'panning' | 'none'
  readonly drag: {
    readonly startX: number
    readonly startY: number
    readonly currentX: number
    readonly currentY: number
    readonly offsetX: number
    readonly offsetY: number
  }
  readonly mouseUpAction?: DeselectOne | DeselectAllBut
}

export interface Node {
  readonly id: string
  readonly name: string
  readonly box: Box
  readonly fields: Field[]
}

export interface Field {
  readonly name: string
  readonly connection?: {
    readonly fromDirection: 'left' | 'right'
    readonly toNodeId: string
    readonly toDirection: 'left' | 'right'
  }
}

export interface Box {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export interface DeselectOne {
  readonly type: 'DeselectOne'
  readonly id: string
}

export interface DeselectAllBut {
  readonly type: 'DeselectAllBut'
  readonly id: string
}
