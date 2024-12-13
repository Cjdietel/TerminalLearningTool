import React, { useState, useEffect, useRef } from 'react';
import '../Terminal.css';

const Terminal = (props) => {
  const { 
    currentDirectory, 
    currentPath, 
    cd, 
    output, 
    addOutput, 
    setOutput, 
    setCurrentDirectory, 
    mkdir, 
    rmdir, 
    touch, 
    echo,
  } = props;
  const [userName, setUserName] = useState('cjdietel');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    console.log(currentDirectory);
  }, [currentDirectory]);

  useEffect(() => {
    const handleMouseClick = () => {
      inputRef.current.focus();
    };

    document.addEventListener('click', handleMouseClick);
    
    // Cleanup on component unmount
    return () => {
      document.removeEventListener('click', handleMouseClick);
    };
  }, []);

  const handleInput = (e) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      addOutput(`(${userName}@TerminalLearningTool)-[${currentPath}]$ ${command}`);

      setHistory([...history, command]);
      setHistoryIndex(history.length);

      ////////////////////////////////////
      //                                //
      //            COMMANDS            //
      //                                //
      ////////////////////////////////////

      // HANDLE CD
      if (command.startsWith('cd ')) {
        const newDir = command.split(' ')[1];
        cd(newDir);
      // HANDLE LS
      } else if (command === 'ls') {
        const filesAndDirs = Object.keys(currentDirectory).map((name) => {
          return (
            <span key={name} style={{ color: currentDirectory[name] instanceof Object ? 'lightblue' : 'inherit', marginRight: '0.5em' }}>
              {name}
            </span>
          );
        });

        addOutput(<div>{filesAndDirs}</div>);
      } 
      // HANDLE CAT
      else if (command.startsWith('cat ')) {
        const fileName = command.split(' ')[1];
        const fileContent = currentDirectory[fileName].content;
        console.log(fileContent);

        if (typeof fileContent === 'string') {
          addOutput(<div>{fileContent}</div>);
        } else {
          addOutput(`No such file: ${fileName}`);
        }
      }
      // HANDLE RM
      else if (command.startsWith('rm ')) {
        const fileName = command.split(' ')[1];

        if (currentDirectory.hasOwnProperty(fileName)) {
          const newDirectory = { ...currentDirectory };
          delete newDirectory[fileName];
          setCurrentDirectory(newDirectory);
          addOutput(`Removed: ${fileName}`);
        } else {
          addOutput(`No such file: ${fileName}`);
        }
      } 
      // HANDLE CLEAR
      else if (command === 'clear') {
        setOutput([]);
        addOutput("Terminal cleared.");
      } 
      // HANDLE PWD
      else if (command === 'pwd') {

        addOutput(`${currentPath}`)
      }
      // HANDLE UNAME
      else if (command.startsWith('uname')) {

        addOutput('Linux')
      }
      // HANDLE WHOAMI
      else if (command.startsWith('whoami')) {

        addOutput(`${userName}`)
      }
      // HANDLE WC
      else if (command.startsWith('wc ')) {
        const fileName = command.split(' ')[1] // works with only one file at the moment
        console.log(fileName)
        const fileContent = currentDirectory[fileName].content
        const lineCount = fileContent.split('\n').length
        const wordCount = fileContent.split(' ').length
        const charCount = fileContent.split('').length
        const wcOutput = `${lineCount} ${wordCount} ${charCount} ${fileName}`
        addOutput(<div>{wcOutput}</div>)
      }
      // HANDLE MKDIR
      else if (command.startsWith('mkdir ')) {
        const newDir = command.split(' ')[1]
        mkdir(newDir)
      }
      // HANDLE RMDIR
      else if (command.startsWith('rmdir ')) {
        const removedDir = command.split(' ')[1]
        rmdir(removedDir)        
      } 
      // HANDLE TOUCH
      else if (command.startsWith('touch ')) {
        const newFile = command.split(' ')[1]
        touch(newFile)
      }
      // HANDLE ECHO
      else if (command.startsWith('echo ')) {
        var currentPart = "";
        var inQuotes = false;
        var commandArray = [];
        var operators = ['>','>>']
        // const file = command.split(' ').at(-1)

        for (let i = 0; i < command.length; i++) {
          const char = command[i];
          if (char === '"' || char === "'") {
            inQuotes = !inQuotes
            continue
          }
          if (char === ' ' && !inQuotes) {
            if (currentPart) {
              if (commandArray.length === 0) {
                commandArray.push(currentPart);
              } else if (operators.includes(currentPart)) { // Push the operator separately
                commandArray.push(currentPart);
              } else if (commandArray.length === 1 || operators.includes(commandArray[commandArray.length - 1])) { // Push file name after the operator
                commandArray.push(currentPart);
              } else {
                if (commandArray.length > 1 && !operators.includes(commandArray[commandArray.length - 1])) { // Group words between "echo" and the operator
                  commandArray[1] += " " + currentPart;
                } else {
                  commandArray.push(currentPart);
                }
              }
              currentPart = ""
            }
            continue;
          }
          currentPart += char;
        }
        


        if (currentPart) {
          if (commandArray.length > 1 && !operators.includes(commandArray[commandArray.length - 1])) {
            commandArray[1] += " " + currentPart;
          } else {
            commandArray.push(currentPart);
          }
        }


        console.log(commandArray)
        const echoText = commandArray[1]
        if (commandArray.length == 2) {
          addOutput(echoText)
        }
        else {
          const operator = commandArray[2]
          const file = commandArray[3]
          console.log([echoText, operator, file])
          echo(echoText, operator, file)
        }
      }
      else {
        addOutput(`Command not found: ${command}`);
      }

      setInput(''); // Clear the input
    } else if (e.key === 'ArrowUp') {
      // Navigate up in history
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setInput(history[historyIndex - 1]);
      }
    } else if (e.key === 'ArrowDown') {
      // Navigate down in history
      if (historyIndex < history.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setInput(history[historyIndex + 1]);
      } else {
        setHistoryIndex(history.length);
        setInput('');
      }
    }
  };

  return (
    <div className="terminal">
      <div className="output">
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <div className="input-container">
        <div style={{ paddingRight: "0.5em" }}>{`(${userName}@TerminalLearningTool)-[${currentPath}]$`}</div>
        <div style={{ overflowWrap: "anywhere", flexGrow: "1" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInput}
            ref={inputRef}
            className="input"
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
