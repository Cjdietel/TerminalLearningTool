import Terminal from './components/Terminal';
import './App.css';
import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import config from './config.json';
import ProblemPanel from './components/ProblemPanel';
import FSTree from './components/FSTree'
import UsernamePopup from './components/UsernamePopup';
import { useAppContext } from './shared/AppContext';


function App() {
  const [fs, setFs] = useState(null); // The full file system
  const [currentDirectory, setCurrentDirectory] = useState(null); // The current directory object
  const [currentPath, setCurrentPath] = useState("/"); // String to hold the current path
  const [output, setOutput] = useState([]); // Output state to hold terminal messages
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userName, setUserName] = useState('');
  const [showPopup, setShowPopup] = useState(true);



  window.onbeforeunload = function() {
    return "Data will be lost if you leave the page, are you sure?";
  };


  function createFSObject() {
    return new Promise((resolve, reject) => {
      JSZipUtils.getBinaryContent(config.zippedFolder, function (err, data) {
        if (err) {
          return reject(err);
        }
        JSZip.loadAsync(data).then(function (zip) {
          const fs = {};
          const promises = [];

          zip.forEach(function (path, entry) {
            let filePathArray = entry.name.endsWith('/')
              ? entry.name.slice(0, -1).split('/')
              : entry.name.split('/');

            let currentLevel = fs;
            for (let i = 0; i < filePathArray.length; i++) {
              const pathPart = filePathArray[i];

              if (pathPart.includes('.')) {
                const filePromise = entry.async("string").then((content) => {
                  // currentLevel[pathPart] = content;
                  currentLevel[pathPart] = {
                    content: content,
                    date_modified: Date()
                  };
                });
                promises.push(filePromise);
              } else {
                if (!currentLevel[pathPart]) {
                  currentLevel[pathPart] = {};
                }
                currentLevel = currentLevel[pathPart];
              }
            }
          });

          Promise.all(promises)
            .then(() => resolve(fs))
            .catch(reject);
        });
      });
    });
  }

  useEffect(() => {
    createFSObject()
      .then((fileSystem) => {
        setFs(fileSystem);
        setCurrentDirectory(fileSystem); // Start at root
      })
      .catch((error) => {
        addOutput(`Error creating file system object: ${error.message}`);
      });
  }, []);

  const addOutput = (message) => {
    setOutput(prevOutput => [...prevOutput, message]);
  };


  const cd = (newDir) => {
    if (newDir === "..") {
      if (currentPath !== "/") {
        const pathArray = currentPath.split("/").filter(Boolean);
        pathArray.pop(); // Remove last directory
        const newPath = pathArray.length ? `/${pathArray.join("/")}` : "/";
        setCurrentPath(newPath);
        setCurrentDirectory(getDirectoryFromPath(newPath));
      } else {
        addOutput("Already at root directory.");
      }
    } else if (currentDirectory[newDir]) {
      const newPath = currentPath === "/" ? `/${newDir}` : `${currentPath}/${newDir}`;
      setCurrentPath(newPath);
      setCurrentDirectory(currentDirectory[newDir]);
    } else {
      addOutput(`No such directory: ${newDir}`);
    }
  };

  const mkdir = (newDir) => {
    if (!currentDirectory[newDir]) {
      currentDirectory[newDir] = {}
      // console.log('1')
    }
    else {
      addOutput(`Directory already exists: ${newDir}`)
      // console.log('0')
    }
  }

  const rmdir = (dirToDelete) => {
    if (currentDirectory[dirToDelete]) {
      delete currentDirectory[dirToDelete]
      console.log('1')
    }
    else {
      addOutput(`Directory does not exist: ${dirToDelete}`)
      console.log('0')
    }
  }

  const touch = (newFileName) => {
    // console.log(newFileName)
    if (!currentDirectory[newFileName]) {
      currentDirectory[newFileName] = {
        content: '',
        date_modified: Date()
      }
    }
    else {
      currentDirectory[newFileName].date_modified = Date() // updates the touched file date_modified to the current date (destructive, changes the original object)
    }

  }

  const echo = (text, operator, file) => {
    if (operator === '>') {
      console.log(file)
      currentDirectory[file].content = text
      currentDirectory[file].date_modified = Date()
    }
    else if (operator === '>>') {
      currentDirectory[file].content += text
      currentDirectory[file].date_modified = Date()
    }
  }

  const getDirectoryFromPath = (path) => {
    const pathParts = path.split("/").filter(Boolean);
    let dir = fs;
    for (const part of pathParts) {
      dir = dir[part];
      if (!dir) return null;
    }
    return dir;
  };

  return (
    <div className="App" style={{ overflowY: "none" }}>
      {showPopup && (
        <UsernamePopup
          setUserName={(name) => {
            setUserName(name);
            setShowPopup(false);
          }}
        />
      )}
      <div style={{ width: "70%", height: "100%", flexGrow: "0" }}>
        {currentDirectory && (
          <Terminal
          setCurrentDirectory={setCurrentDirectory}
            currentDirectory={currentDirectory}
            currentPath={currentPath}
            currentProblemIndex={currentProblemIndex}
            setCurrentProblemIndex={setCurrentProblemIndex}
            userName={userName}
            showPopup={showPopup}
            cd={cd}
            output={output}
            addOutput={addOutput}
            setOutput={setOutput}
            mkdir={mkdir}
            rmdir={rmdir}
            touch={touch}
            echo={echo}
            
          />
        )}
      </div>
      <div
        style={{
          flexGrow: "1",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "black",
        }}
      >
        <ProblemPanel 
        currentProblemIndex={currentProblemIndex}
        setCurrentProblemIndex={setCurrentProblemIndex}
        currentDirectory={currentDirectory}
        currentPath={currentPath}
        />
        <FSTree 
        currentDirectory={currentDirectory}
        currentPath={currentPath}
        />
      </div>
    </div>
  );
}

export default App;
