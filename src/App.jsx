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

import Terminal from './components/Terminal';
import './App.css'
import { useState, useEffect, React } from 'react';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';

function createFSObject() {
  let fs = {}

    JSZipUtils.getBinaryContent('ShellAdventure-main.zip', function(err, data) { // JSZip website -- for testing purposes we use ShellAdventure-main.zip or zipped.zip, but this can be changed to your zip of a file system
        if(err) {
            throw err; 
        }
        JSZip.loadAsync(data).then(function (data) {
            data.forEach(function(path, entry){ // even though path is not used, it is needed for the function to work
                let filePathArray 
                if (entry.name.endsWith('/')) {
                    filePathArray = entry.name.slice(0, -1).split('/'); // removes the "empty directory" created with the ending slash
                  } else {
                    filePathArray = entry.name.split('/');
                  }
                let currentLevel = fs // start at root
                for (let i = 0; i < filePathArray.length; i++) {
                    const pathPart = filePathArray[i]
                    if (pathPart.includes('.')) {
                        entry.async("string").then((content) => { // loads the contents of the file
                          currentLevel[pathPart] = content;
                        });
                    }
                    else {
                        if (!currentLevel[pathPart]) {
                            currentLevel[pathPart] = {};
                        }
                        currentLevel = currentLevel[pathPart]
                    }
                }
            }) 
            console.log(fs)
        });
    });
}

function App() {
  return (
    <div className="App" style={{ overflowY: "none"}}>
      <div style={{ width:"70%", height:"100%", flexGrow: "0"}}>
        <Terminal />
        <pre>{createFSObject()}</pre>
      </div>
      <div style={{ flexGrow: "1", display: "flex", flexDirection: "column",  backgroundColor: "black"}}>
        <div style={{ height: "50%", width: "100%", padding: "0.2em"}}>
          <div style={{height: "100%", width: "100%", backgroundColor: "#1E2D2F"}}></div>
        </div>
        <div style={{ heigiht: "50%", width: "100%", padding: "0 0.2em 0.2em 0.2em"}}>
          <div style={{height: "100%", width: "100%", backgroundColor: "#C57B57"}}></div>
        </div>
      </div>
    </div>
    // <div style={{height:'100%', border:'1px solid lime'}}></div>
  );
}

export default App;


