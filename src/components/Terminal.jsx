import React, { useState, useEffect } from 'react';
import '../Terminal.css';

const Terminal = (props) => {
  const { currentDirectory, currentPath, cd, output, addOutput, setOutput, setCurrentDirectory } = props;
  const [userName, setUserName] = useState('cjdietel');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    console.log(currentDirectory);
  }, [currentDirectory]);

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
            className="input"
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
