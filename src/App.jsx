import Terminal from './components/Terminal';
import './App.css';
import { useState, useEffect } from 'react';
import JSZip, { file } from 'jszip';
import JSZipUtils from 'jszip-utils';
import config from './config.json';
import ProblemPanel from './components/ProblemPanel';
import FSTree from './components/FSTree'
import UsernamePopup from './components/UsernamePopup';


function App() {
  const [fs, setFs] = useState(null); // The full file system
  const [currentDirectory, setCurrentDirectory] = useState(null); // The current directory object
  const [currentPath, setCurrentPath] = useState("/"); // String to hold the current path
  const [output, setOutput] = useState([]); // Output state to hold terminal messages
  // const [problems, setProblems] = useState();
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userName, setUserName] = useState('');
  const [showPopup, setShowPopup] = useState(true);
  const [fsChange, setFSChange] = useState(0);



  window.onbeforeunload = function() {
    return "Data will be lost if you leave the page, are you sure?";
  };

  function getRandomWord(wordList) {
    return wordList[Math.floor(Math.random() * wordList.length)];
  }
  
  function createFSObject() {
    return new Promise((resolve, reject) => {
      JSZipUtils.getBinaryContent(config.zippedFolder, function (err, data) {
        if (err) {
          return reject(err);
        }
        JSZip.loadAsync(data).then(async function (zip) {
          const fs = {
            content: {},
            date_modified: new Date().toISOString(),
            is_file: false,
          };
          const promises = [];
          const nameMapping = {}; // Maps original names to random names
          
          // Load the word list
          const wordListResponse = await fetch(config.wordList);
          const wordListText = await wordListResponse.text(); 
          const wordList = wordListText.split("\n").map(word => word.trim()).filter(Boolean);
  
          zip.forEach(function (path, entry) {
            let filePathArray = entry.name.endsWith('/')
              ? entry.name.slice(0, -1).split('/')
              : entry.name.split('/');
  
            let currentLevel = fs.content;
            for (let i = 0; i < filePathArray.length; i++) {
              let originalName = filePathArray[i];
  
              // Handle files separately
              let randomName;
              if (originalName.includes('.')) {
                let parts = originalName.split('.');
                let extension = parts.pop(); // Extract extension
                let baseName = parts.join('.'); // Remaining name
  
                if (!nameMapping[baseName]) {
                  nameMapping[baseName] = getRandomWord(wordList);
                }
                randomName = `${nameMapping[baseName]}.${extension}`; // Preserve extension
              } else {
                if (!nameMapping[originalName]) {
                  nameMapping[originalName] = getRandomWord(wordList);
                }
                randomName = nameMapping[originalName];
              }
  
              if (randomName.includes('.')) {
                const filePromise = entry.async("string").then((content) => {
                  currentLevel[randomName] = {
                    content: content,
                    date_modified: new Date().toISOString(),
                    is_file: true,
                    permissions: {
                      read: false,
                      write: true,
                      execute: false
                    }
                  };
                });
                promises.push(filePromise);
              } else {
                if (!currentLevel[randomName]) {
                  currentLevel[randomName] = {
                    content: {},
                    date_modified: new Date().toISOString(),
                    is_file: false,
                  };
                }
                currentLevel = currentLevel[randomName].content;
              }
            }
          });
          console.log(fs)
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
        setFs(fileSystem.content);
        setCurrentDirectory(fileSystem.content); // Start at root
      })
      .catch((error) => {
        addOutput(`Error creating file system object: ${error.message}`);
      });
  }, []);

  useEffect(() => {
  }, [fsChange]);


  const addOutput = (message) => {
    setOutput(prevOutput => [...prevOutput, message]);
  };


  const cd = (newDirString) => {
    try {
      const newDir = currentDirectory[newDirString];
      // console.log(newDir)
      if (newDirString === "..") {
        if (currentPath !== "/") {
          const pathArray = currentPath.split("/").filter(Boolean);
          // console.log(pathArray)
          pathArray.pop();
          const newPath = pathArray.length ? `/${pathArray.join("/")}` : "/";
          setCurrentPath(newPath);
          if (newPath === "/") {
            setCurrentDirectory(fs);
          } else {
            const newDirectory = getDirectoryFromPath(newPath);
            setCurrentDirectory(newDirectory.content);
          }
        } else {
          addOutput("Already at root directory.");
        }
      }
      else if (newDirString === "~") {
        setCurrentPath("/"); 
        setCurrentDirectory(fs); 
      }
      else if (newDir.is_file === false) {
        // console.log(newDir.name)
        const newPath = currentPath === "/" ? `/${newDirString}` : `${currentPath}/${newDirString}`;
        setCurrentPath(newPath);
       
        setCurrentDirectory(newDir.content);
      } else {
        addOutput(`No such directory: ${newDirString}`);
      }
    } catch (err) {
      addOutput(`No such directory: ${newDirString}`);
    }
    
  };

  const mkdir = (newDir) => {
    if (!currentDirectory[newDir]) {
      currentDirectory[newDir] = {
        content: {},
        date_modified: new Date().toISOString(),
        is_file: false,
      }
    }
    else {
      addOutput(`Directory already exists: ${newDir}`)
      // console.log('0')
    }
    setFSChange(prev => prev + 1);
  }

  const rmdir = (dirToDelete) => {
    if (currentDirectory[dirToDelete]) {
      delete currentDirectory[dirToDelete]
      // console.log('1')
    }
    else {
      addOutput(`Directory does not exist: ${dirToDelete}`)
      // console.log('0')
    }
    setFSChange(prev => prev + 1);
  }

  const touch = (newFileName) => {
    console.log(newFileName)
    if (!currentDirectory[newFileName]) {
      currentDirectory[newFileName] = {
        content: "",
        date_modified: new Date().toISOString(),
        is_file: true,
        permissions: {
          read: false,
          write: true,
          execute: false
        }
      }
    }
    else {
      currentDirectory[newFileName].date_modified = Date() // updates the touched file date_modified to the current date (destructive, changes the original object)
    }
    setFSChange(prev => prev + 1);
  }

  const echo = (text, operator, file) => {
    if (operator === '>') {
      // console.log(file)
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
    <div className="App" style={{ overflowY: "none", display: "flex", flexGrow: "1" }}>
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
            fs={fs}
          />
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "black",
          width: "30%",
          height: "100%"
        }}
      >
        <ProblemPanel
        currentProblemIndex={currentProblemIndex}
        setCurrentProblemIndex={setCurrentProblemIndex}
        currentDirectory={currentDirectory}
        currentPath={currentPath}
        />
        <FSTree 
        fsChange={fsChange}
        currentDirectory={currentDirectory}
        currentPath={currentPath}
        />
      </div>
    </div>
  );
}

export default App;
