# 🐚 ShellSim

ShellSim is an interactive web-based Linux terminal built to help students learn basic shell commands in a fun, gamified way. It provides a realistic shell-like experience where learners can solve step-by-step problems to gain points, explore a mock file system, and build core command-line skills.

---

## 🚀 Features

  - ✅ Simulated shell environment with familiar prompt syntax  
  - 📁 Mock file system that supports commands like `cd`, `ls`, `touch`, `mkdir`, `rm`, etc.  
  - 🧠 Problem-based learning with a points system  
  - ✨ Visual feedback and confetti on success  
  - ⌨️ Keyboard-friendly: arrow key history, tab completion, Ctrl+L to clear  
  - 🔐 Safe: All commands are sandboxed and simulate state only  
  - 🎯 Tracks progress across problems and gives completion indicators

  ### Supported Commands:
  - cd
  - ls (flags -l and -a supported)
  - pwd
  - mkdir
  - rmdir
  - rm
  - touch
  - cat
  - echo
  - wc
  - clear
  - uname
  - whoami

  ### Problem System:

  Each problem includes:
  - ✅ A prompt/instruction
  - 🧠 Expected solution (command)
  - 📍 State checks (directory, output, etc.)
  - 🌟 Points awarded
  - 🎉 Completion feedback
  Correct answers are validated via a validateCommand() function and animated using confetti when solved.

  ### Scoring System:

  - Each problem has a __points__ value.
  - Points are accumulated on correct answers.
  - Confetti bursts when a problem is completed!
  - The next problem loads automatically.

  ### Keyboard Features:

  - ⬆️ / ⬇️ Arrow keys cycle command history
  - __Tab__ for autocompletion (file/folder names)
  - __Enter__ executes the command
---

## 🛠️ Tech Stack

- **React** — Frontend UI framework  
- **JavaScript** — Core logic and problem evaluation  
- **Canvas-Confetti** — Celebration animations  
- **CSS** — Terminal-style theming  
- **Material UI** — UI package for login popup
- **Primereact** — UI package for file system hierarchy           visualization

---

## 🧑‍💻 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/cjdietel/TerminalLearningTool.git
cd TerminalLearningTool
```
### 2. Install Dependencies

```
npm install
```

### 3. Run the App
```
npm start
```
---
## ✏️ Customization for Instructors

ShellSim is designed to be modified based off of the specific needs of an instructor. To achieve this, adding new commands is straightforward. All commands are stored as __.jsx__ files in __src/commands__. Instructors can create their own commands wrapped in the following format:
```js
const exampleCommand = (args, { example, pass_state_here }) => {
    // code goes here
    }
  export default exampleCommand;
```

The following state can be passed through commands and used to help you in problem integration:
- __currentPath__ — retrieve the path of the current working directory
- __setCurrentPath__ — set the working directory path
- __currentDirectory__ — retrieve the current working directory name
- __setCurrentDirectory__ — set which directory is currently active
- __createOutput__ — push an output to the terminal for display

Once the function is created in a .jsx file, it must be saved with the name of the function that is desired to be called. For example, __ls__ is stored in __ls.jsx__. Once the file is loaded into __src/commands__, __handleCommands.jsx__ will automatically load it into ShellSim.

There are currently four types of problems. The number of times each type of problem appears in a set can be configured in the __config.json__ file. 

- __Problem type 1 (numType1)__ — Display current items inside current directory.
- __Problem type 2 (numType2)__ — Navigate to a specific location in the file system.
- __Problem type 3 (numType3)__ — Create specific file or directory.
- __Problem type 4 (numType4)__ — Delete specific file.

The file system is generated based off of a zipped folder specified in __config.json__. Instructors can load their own by specifying the path to a different zipped folder.

It is recommended that instructors create man functions for their commands. Add a second exported function to achieve this in the following format:

```js
export const commandnameMan = () => 
    `
    commandname:

    Usage:
    
    Description:

    Example:
    `;
```