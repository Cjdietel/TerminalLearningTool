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
    input,
    setInput
  } = props;
  const [userName, setUserName] = useState('cjdietel');
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
        const fileContent = currentDirectory[fileName];

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
        const fileContent = currentDirectory[fileName]
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
        const commandArray = command.split(' ')
        console.log(commandArray)
        const echoText = commandArray[1]
        const file = commandArray.slice(-1)[0] // only used with operators
        console.log(file)
        var operator = ''
        if (commandArray.includes('>')) {
          operator = '>'
          echo(echoText, operator, file)
        } else if (commandArray.includes('>>')) {
          operator = '>>'
          echo(echoText, operator, file)
        }
        else { // no write to file operator
          addOutput(echoText)
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
