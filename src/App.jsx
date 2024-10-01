// import { useState } from 'react'
// import './App.css'
// import ProblemPanel from './components/ProblemPanel'

// import Shell from './components/Shell'


// function App() {

//   return (
//     <div style={{ width: "100%", height: "100%", display: 'flex'}}>
//       <Shell />
//       <ProblemPanel />
//     </div>
//   )
// }

// export default App
import React, { useState } from 'react';
import Terminal from 'react-console-emulator';

const MyTerminal = () => {
  const [currentDir, setCurrentDir] = useState('/home/user');

  const filesystem = {
    '/home/user': ['file1.txt', 'file2.txt', 'Documents', 'Downloads'],
    '/home/user/Documents': ['doc1.pdf', 'doc2.docx'],
    '/home/user/Downloads': ['file3.zip', 'file4.mp3'],
  };

  const commands = {
    ls: {
      description: 'List files in the current directory.',
      fn: () => filesystem[currentDir].join('\n')
    },
    cd: {
      description: 'Change the current directory.',
      usage: 'cd <directory>',
      fn: (dir) => {
        const newDir = `${currentDir}/${dir}`.replace(/\/+/g, '/'); // Normalize path
        if (filesystem[newDir]) {
          setCurrentDir(newDir);
          return `Changed directory to ${newDir}`;
        } else {
          return `Directory not found: ${dir}`;
        }
      }
    },
    pwd: {
      description: 'Print the current directory.',
      fn: () => currentDir
    },
  };

  return (
    <Terminal
      style={{ width: '70vw', height: "100vh", overflowY:"hidden", backgroundColor: '#041F1E',}}
      commands={commands}
      // welcomeMessage={`Welcome to the React terminal! Current directory: ${currentDir}`}
      promptLabel={`user@ShellLearningTool:${currentDir}$ `}
    />
  );
};

export default MyTerminal;
