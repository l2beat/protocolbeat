import { Node } from './State'

export const EXAMPLE_NODES: Node[] = [
  {
    id: '1',
    name: 'Mickey Mouse',
    box: {
      x: 20,
      y: 20,
      width: 200,
      height: 200,
    },
    fields: [
      {
        name: 'daisy',
        connection: {
          fromDirection: 'left',
          toNodeId: '2',
          toDirection: 'left',
        },
      },
      {
        name: 'goofy',
        connection: {
          fromDirection: 'right',
          toNodeId: '3',
          toDirection: 'left',
        },
      },
    ],
  },
  {
    id: '2',
    name: 'Daisy Duck',
    box: {
      x: 250,
      y: 20,
      width: 200,
      height: 200,
    },
    fields: [],
  },
  {
    id: '3',
    name: 'Goofy',
    box: {
      x: 250,
      y: 250,
      width: 200,
      height: 200,
    },
    fields: [],
  },
]
