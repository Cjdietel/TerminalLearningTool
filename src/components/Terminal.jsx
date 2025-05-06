import React, { useState, useEffect, useRef } from 'react';
import '../Terminal.css';
import { validateCommand } from './ProblemPanel';
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
    setCurrentPath,
    mkdir, 
    rmdir,
    rm, 
    touch, 
    echo,
    fs,
    problems,
    setProblems
  } = props;

  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastCommand, setLastCommand] = useState(''); // Track the last executed command
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [output]);
  
  useEffect(() => {
    addOutput(`

      .d8888b.  888               888 888  .d8888b.  d8b               
      d88P  Y88b 888               888 888 d88P  Y88b Y8P               
      Y88b.      888               888 888 Y88b.                        
       "Y888b.   88888b.   .d88b.  888 888  "Y888b.   888 88888b.d88b.  
          "Y88b. 888 "88b d8P  Y8b 888 888     "Y88b. 888 888 "888 "88b 
            "888 888  888 88888888 888 888       "888 888 888  888  888 
      Y88b  d88P 888  888 Y8b.     888 888 Y88b  d88P 888 888  888  888 
       "Y8888P"  888  888  "Y8888  888 888  "Y8888P"  888 888  888  888 
                          
      ShellSim v1.0.0
      An educational, interactive Unix-like shell simulator.

      Type help to list all available commands.

      Tips:
      • Use ↑ and ↓ to scroll through your command history.
      • Press Tab for auto-completion of file/directory names.
      • Explore freely — mistakes won’t break anything!  
   `)
  }, []);

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
      e.preventDefault();
      const command = input.trim();
      addOutput(`(${userName}@ShellSim)-[${currentPath}]$ ${command}`);
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
        setCurrentPath,
        mkdir,
        rmdir,
        rm,
        touch,
        echo,
        fs
      });

      setInput('');
      setLastCommand(command); // Update the last executed command
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

  // Validate the command after currentPath updates
  useEffect(() => {
    if (lastCommand) {
      validateCommand(lastCommand, currentProblemIndex, setCurrentProblemIndex, problems, setProblems, fs, currentPath);
    }
  }, [lastCommand]);

  // after your handleInput, before return:
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }, [input]);
  


  return (
    <div className="terminal">
<div className="output">
  {output.map((line,i) => <div key={i}>{line}</div>)}
</div>
<div className="input-container">
  <div className="prompt">
    {`(${userName}@ShellSim)-[${currentPath}]$`}
  </div>
  <textarea
    rows={1}
    className="cmd-input"
    value={input}
    onChange={e => setInput(e.target.value)}
    onKeyDown={handleInput}
    ref={inputRef}
    autoFocus
  />
  <div ref={bottomRef} />
</div>
    </div>
  );
};

export default Terminal;
