import React, { useState, useEffect} from 'react';
import '../Terminal.css';
// fs structure
// [
//     {
//         "home": 
//         {
//             type: "directory",
//             content: 
//             {
//                 "documents" : 
//                 {
//                     type: "directory",
//                     content: 
//                     {
//                         "test1.txt": 
//                         {
//                             type: "file",
//                             content: "hello world"
//                         }
//                     }
//                 },
//                 "downloads": 
//                 {
//                     type: "directory",
//                     content: 
//                     {
//                         "test1.txt": 
//                         {
//                             type: "file",
//                             content: "hello world"
//                         },
//                         "test2.txt": 
//                         {
//                             type: "file",
//                             content: "hello world2"
//                         }
//                     }
                
//                 }
//             }
//         }
//     }
// ]



const Terminal = () => {
  const [dirLoc, setDirLoc] = useState('~/Documents')
  const [userName, setUserName] = useState('cjdietel')
  const [cmdLine, setCmdLine] = useState(`(${userName}@TerminalLearningTool)-[${dirLoc}]$`)
  const [output, setOutput] = useState([]);
  const [input, setInput] = useState('');


//   const inputRef = useRef(null);

  useEffect(() => {
    // inputRef.current.focus();
  }, []);
  
  const handleInput = (e) => {
    if (e.key === 'Enter') {
      setOutput([...output, `(${userName}@TerminalLearningTool)-[${dirLoc}]$ ${input}`]);
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
        <div style={{ paddingRight: "0.5em"}}>{`(${userName}@TerminalLearningTool)-[${dirLoc}]$`}</div>
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
