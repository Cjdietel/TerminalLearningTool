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
import config from './config.json'


let fs = {}

function createFSObject() {
  return new Promise((resolve, reject) => {
      JSZipUtils.getBinaryContent(config.zippedFolder, function (err, data) {
          if (err) {
              return reject(err); // Reject the promise if there is an error
          }

          JSZip.loadAsync(data).then(function (zip) {
              const fs = {}; // Initialize the file system object
              const promises = []; // Array to track asynchronous operations

              zip.forEach(function (path, entry) {
                  let filePathArray;
                  if (entry.name.endsWith('/')) {
                      filePathArray = entry.name.slice(0, -1).split('/'); // Removes the empty directory created with the ending slash
                  } else {
                      filePathArray = entry.name.split('/');
                  }

                  let currentLevel = fs; // Start at root level of fs object
                  for (let i = 0; i < filePathArray.length; i++) {
                      const pathPart = filePathArray[i];

                      // If the path part contains a dot, assume it's a file
                      if (pathPart.includes('.')) {
                          // Push the file load operation into the promises array
                          const filePromise = entry.async("string").then((content) => {
                              currentLevel[pathPart] = content; // Assign file content to the correct path
                          });
                          promises.push(filePromise); // Track the promise
                      } else {
                          // If it's a folder, create it if it doesn't exist
                          if (!currentLevel[pathPart]) {
                              currentLevel[pathPart] = {};
                          }
                          currentLevel = currentLevel[pathPart]; // Navigate into the folder
                      }
                  }
              });

              // Once all promises are resolved, resolve the main promise with the fs object
              Promise.all(promises)
                  .then(() => resolve(fs)) // Resolve with the fully populated file system object
                  .catch(reject); // Reject the promise in case of any errors
          });
      });
  });
}

function App() {

  useEffect(() => {
    createFSObject()
    .then((fs) => {
        console.log(fs.zipped.folder1);
    })
    .catch((error) => {
        console.error("Error creating file system object:", error);
    });
  }, [])

  const [currentDirectory, setCurrentDirectory] = useState('/Home')
  console.log(currentDirectory)

  return (
    <div className="App" style={{ overflowY: "none"}}>
      <div style={{ width:"70%", height:"100%", flexGrow: "0"}}>
        <Terminal currentDirectory={currentDirectory}/>
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


