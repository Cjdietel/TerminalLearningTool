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
  - ls
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
  - ___Ctrl + L___ clears the screen (via ___clear___ command)
---

## 🛠️ Tech Stack

- **React** — Frontend UI framework  
- **JavaScript** — Core logic and problem evaluation  
- **Canvas-Confetti** — Celebration animations  
- **CSS** — Terminal-style theming  

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
