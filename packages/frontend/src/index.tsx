import React from 'react'
import ReactDOM from 'react-dom/client'

import { TestApp } from './TestApp'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
)
