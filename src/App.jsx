// import { useState } from 'react'
// import './App.css'
// import ProblemPanel from './components/ProblemPanel'

// import Shell from './components/Shell'


// function App() {

//   return (
//     <div style={{ width: "100%", height: "100%", display: 'flex'}}>
//       <Shell />
//       <ProblemPanel />
//     </div>
//   )
// }

// export default App
import React, { useState } from 'react';
import Terminal from './components/Terminal';
import JSzip from 'jszip'
import './App.css'

function App() {
  return (
    <div className="App" style={{ overflowY: "none"}}>
      <div style={{ width:"70%", height:"100%", flexGrow: "0"}}>
        <Terminal />
      </div>
      <div style={{ flexGrow: "1", display: "flex", flexDirection: "column",  backgroundColor: "black"}}>
        <div style={{ height: "50%", width: "100%", padding: "0.2em"}}>
          <div style={{height: "100%", width: "100%", backgroundColor: "#1E2D2F"}}></div>
        </div>
        <div style={{ height: "50%", width: "100%", padding: "0 0.2em 0.2em 0.2em"}}>
          <div style={{height: "100%", width: "100%", backgroundColor: "#C57B57"}}></div>
        </div>
      </div>
    </div>
    // <div style={{height:'100%', border:'1px solid lime'}}></div>
  );
}

export default App;


