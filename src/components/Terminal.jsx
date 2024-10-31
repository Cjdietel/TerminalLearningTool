import React, { useState, useEffect } from 'react';
import '../Terminal.css';

const Terminal = (props) => {
  const { currentDirectory, currentPath, cd, output, addOutput } = props;
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
        const files = Object.keys(currentDirectory).join(', ');
        addOutput(`Files: ${files}`);
      } else {
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
