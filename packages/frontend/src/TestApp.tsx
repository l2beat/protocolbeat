import { Viewport } from './view/Viewport'

export const EXAMPLE_NODES = [
  {
    id: '1',
    name: 'Mickey Mouse',
    fields: [
      { name: 'daisy', connection: '2' },
      { name: 'goofy', connection: '3' },
    ],
  },
  { id: '2', name: 'Daisy Duck', fields: [] },
  { id: '3', name: 'Goofy', fields: [] },
]

export function TestApp() {
  return <Viewport nodes={EXAMPLE_NODES} />
}
