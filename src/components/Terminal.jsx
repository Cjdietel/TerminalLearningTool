import React, { useState, useEffect, useRef } from 'react';
import '../Terminal.css';
import { validateCommand } from './ProblemPanel';
import { problems } from '../Problems';
import handleCommand from './handleCommand';

const Terminal = (props) => {
  const { 
    currentDirectory, 
    currentPath, 
    userName,
    currentProblemIndex,
    setCurrentProblemIndex,
    showPopup,
    cd, 
    output, 
    addOutput, 
    setOutput, 
    setCurrentDirectory, 
    mkdir, 
    rmdir, 
    touch, 
    echo,
    fs
  } = props;
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    // console.log(currentDirectory);
  }, [currentDirectory]);

  useEffect(() => {
    const handleMouseClick = () => {
      if (!showPopup) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleMouseClick);
    return () => {
      document.removeEventListener('click', handleMouseClick);
    };
  }, [showPopup]);

  const handleInput = (e) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      addOutput(`(${userName}@TerminalLearningTool)-[${currentPath}]$ ${command}`);
      setHistory([...history, command]);
      setHistoryIndex(history.length);
  
      handleCommand(command, {
        currentDirectory,
        currentPath,
        userName,
        cd,
        addOutput,
        setOutput,
        setCurrentDirectory,
        mkdir,
        rmdir,
        touch,
        echo,
        fs
      });
  
      setInput('');
      validateCommand(command, currentProblemIndex, setCurrentProblemIndex, problems, fs);
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setInput(history[historyIndex - 1]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setInput(history[historyIndex + 1]);
      } else {
        setHistoryIndex(history.length);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
  
      const parts = input.split(' ');
      const partial = parts[parts.length - 1];
      const matches = Object.keys(currentDirectory).filter(name => name.startsWith(partial));
  
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        setInput(parts.join(' '));
      } else if (matches.length > 1) {
        addOutput(matches.join(' '));
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
