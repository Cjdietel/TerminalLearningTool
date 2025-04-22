import Terminal from './components/Terminal';
import './App.css';
import { useState, useEffect } from 'react';
import JSZip, { file } from 'jszip';
import JSZipUtils from 'jszip-utils';
// const JSZip = import('jszip');
// const JSZip = await import('jszip/dist/jszip')
// const JsZip = await import('jszip/dist/jszip')
// const JSZipUtils = new JsZip.default();
import config from './config.json';
import ProblemPanel from './components/ProblemPanel';
import FSTree from './components/FSTree'
import { init, generateProblems } from './Problems';
import UsernamePopup from './components/UsernamePopup';
import { getRandomWord } from './utils';


function App() {
  const [fs, setFs] = useState(null); // The full file system
  const [currentDirectory, setCurrentDirectory] = useState(null); // The current directory object
  const [currentPath, setCurrentPath] = useState("/"); // String to hold the current path
  const [output, setOutput] = useState([]); // Output state to hold terminal messages
  const [problems, setProblems] = useState({});
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userName, setUserName] = useState('');
  const [showPopup, setShowPopup] = useState(true);
  const [fsChange, setFSChange] = useState(0);

  const reservedDirWords = ["bin", "etc", "usr", "var", "home", "root", "tmp", "sbin", "opt", "user"];

  init()
  window.onbeforeunload = function() {
    return "Data will be lost if you leave the page, are you sure?";
  };

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
                    is_hidden: false,
                    permissions: {
                        read: true,
                        write: true,
                        execute: true
                    }
                };
                const promises = [];
                const nameMapping = {}; // Maps original names to random names

                // Load the word list
                const wordListResponse = await fetch(config.wordList);
                const wordListText = await wordListResponse.text();
                const wordList = wordListText.split("\n").map(word => word.trim()).filter(Boolean);

                zip.forEach((path, entry) => {
  // 1) strip trailing slash, split, then drop first folder
                    const allParts = entry.name.replace(/\/$/, "").split("/");
                    const parts    = allParts.slice(1);
                    if (parts.length === 0) return;  // ignore the top‐level wrapper

                    let level = fs.content;
                    for (let i = 0; i < parts.length; i++) {
                      const originalName = parts[i];
                    let mappedName;
                
                    // 1) if it's the special "user" folder, use the entered userName
                    if (originalName === "user") {
                      mappedName = userName;
                    }
                    // 2) else if it’s a reserved dir, keep it
                    else if (reservedDirWords.includes(originalName)) {
                      mappedName = originalName;
                    }
                    // 3) otherwise randomize as before
                    else {
                      if (!nameMapping[originalName]) {
                        nameMapping[originalName] = getRandomWord(wordList);
                      }
                      mappedName = nameMapping[originalName];
                    }
                
                    const isLast = i === parts.length - 1;
                    const isHidden = originalName.startsWith(".");
                
                    if (isLast) {
                      if (entry.dir) {
                        level[mappedName] = level[mappedName] || {
                          content: {},
                          date_modified: new Date().toISOString(),
                          is_file: false,
                          is_hidden: isHidden,
                          permissions: { read: true, write: true, execute: true }
                        };
                      } else {
                        promises.push(
                          entry.async("string").then(text => {
                            level[mappedName] = {
                              content: text,
                              date_modified: new Date().toISOString(),
                              is_file: true,
                              is_hidden: isHidden,
                              permissions: { read: true, write: true, execute: true }
                            };
                          })
                        );
                      }
                    } else {
                      level[mappedName] = level[mappedName] || {
                        content: {},
                        date_modified: new Date().toISOString(),
                        is_file: false,
                        is_hidden: isHidden,
                        permissions: { read: true, write: true, execute: true }
                      };
                      level = level[mappedName].content;
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
      setFs(fileSystem.content);
      console.log(fileSystem.content);
      setCurrentDirectory(fileSystem.content);
      setProblems(generateProblems(fileSystem.content));
    })
    .catch((error) => {
      addOutput(`Error creating file system object: ${error.message}`);
    });
}, [userName]);

  // useEffect(() => {
  // }, [fsChange]);

  // useEffect(() => {
  //     // const generatedProblems = generateProblems(fs);
  //     if (fs)
  //     {
  //       setProblems(generateProblems(fs));
  //       console.log(problems);
  //       setTimeout(() => {}, 100);
  //       }
  // }, [fs]); // Re-run only when fs changes
  const addOutput = (message) => {
    setOutput(prevOutput => [...prevOutput, message]);
  };

  // console.log(fs)
  const cd = (newDirString) => {

    const pathIsAbsolute = newDirString.startsWith("/");
    let workingDirectory = pathIsAbsolute ? fs : currentDirectory;
    let workingPathTokens = pathIsAbsolute ? [] : currentPath.split("/").filter(Boolean);
    const tokens = newDirString.split("/").filter(token => token.length > 0);

    for (let token of tokens) {
      if (token === ".") {
        continue;
      }
      else if (token === "..") {
        if (workingPathTokens.length > 0) {
          workingPathTokens.pop();
          let newPathString = workingPathTokens.length ? `/${workingPathTokens.join("/")}` : "/";
          workingDirectory = newPathString === "/" ? fs : getDirectoryFromPath(newPathString).content;
        } else {
          addOutput("Already at root directory.");
          return;
        }
      }
      else if (token === "~") {
        workingDirectory = fs;
        workingPathTokens = [];
      } else {
        const nextDir = workingDirectory[token];
        if (nextDir && nextDir.is_file === false) {
          workingPathTokens.push(token);
          workingDirectory = nextDir.content;
        }
        else {
          addOutput(`No such directory: ${token}`);
          return;
        }
      }
    }

    const newPathString = workingPathTokens.length ? `/${workingPathTokens.join("/")}` : "/";
    setCurrentPath(newPathString);
    setCurrentDirectory(workingDirectory);

  };

  const mkdir = (newDir) => {
    if (!currentDirectory[newDir]) {
      currentDirectory[newDir] = {
        content: {},
        date_modified: new Date().toISOString(),
        is_file: false,
        is_hidden: newDir.startsWith('.'),
        permissions: {
          read: true,
          write: true,
          execute: true
        }
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

  const rm = (fileToDelete) => {
    if (currentDirectory[fileToDelete]) {
      delete currentDirectory[fileToDelete]
      // console.log('1')
    }
    else {
      addOutput(`File does not exist: ${fileToDelete}`)
      // console.log('0')
    }
    setFSChange(prev => prev + 1);
  }

  
const touch = (newFileName) => {
    // console.log(newFileName)
    if (!currentDirectory[newFileName]) {
      currentDirectory[newFileName] = {
        content: "",
        date_modified: new Date().toISOString(),
        is_file: true,
        is_hidden: newFileName.startsWith('.'),
        permissions: {
          read: true,
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
    // console.log(text, operator, file)
    if (operator === '>') {
      touch(file) // create the file if it doesn't exist
      currentDirectory[file].content = text
      currentDirectory[file].date_modified = Date()
    }
    else if (operator === '>>') {
      touch(file) // create the file if it doesn't exist
      currentDirectory[file].content += text
      currentDirectory[file].date_modified = Date()
    }
    else
    {
      addOutput('Invalid operator. Use > or >>')
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
            setCurrentPath={setCurrentPath}
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
            rm={rm}
            touch={touch}
            echo={echo}
            fs={fs}
            problems={problems}
            setProblems={setProblems}
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
        {(fs && <ProblemPanel
        currentProblemIndex={currentProblemIndex}
        setCurrentProblemIndex={setCurrentProblemIndex}
        currentDirectory={currentDirectory}
        currentPath={currentPath}
        problems={problems}
        setProblems={setProblems}
        fs={fs}
        />)}
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
