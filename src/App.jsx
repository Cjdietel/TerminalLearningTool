import { useState } from 'react'
import './App.css'
import ProblemPanel from './components/ProblemPanel'

import Shell from './components/Shell'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Shell />
      <ProblemPanel />
    </div>
  )
}

export default App
