import React, { useState, useEffect} from 'react';
import '../Terminal.css';




const Terminal = (props) => {

  const { currentDirectory } = props
  // const [dirLoc, setDirLoc] = useState(Object.keys(fs))
  const [userName, setUserName] = useState('cjdietel')
  const [cmdLine, setCmdLine] = useState(`(${userName}@TerminalLearningTool)-[${currentDirectory}]$`)
  const [output, setOutput] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    console.log(currentDirectory)
  }, [])


//   const inputRef = useRef(null);

  
  const handleInput = (e) => {
    if (e.key === 'Enter') {
      setOutput([...output, `(${userName}@TerminalLearningTool)-[${currentDirectory}]$ ${input}`]);
      //alert(input);
      setInput('');
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
        <div style={{ paddingRight: "0.5em"}}>{`(${userName}@TerminalLearningTool)-[${currentDirectory}]$`}</div>
        <div style={{ overflowWrap: "anywhere", flexGrow: "1"}}>
            <input
            //   ref={inputRef}
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
