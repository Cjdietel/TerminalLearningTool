// const commandModules = import.meta.glob('/src/commands/*.jsx', { eager: true });
// const commands = {}
// for (const path in commandModules) {
//   const module = commandModules[path];
//   const fileName = path
//     .split('/')
//     .pop()
//     .replace('.jsx', '');
//   const commandFunc = module.default;
//   commands[fileName] = commandFunc;
// }


// const handleCommand = (command, props) => {
//   const [cmd, ...args] = command.match(/(?:"[^"]*")|(?:'[^']*')|\S+/g) || []; // regex to break up command into array of substrings
//   if (commands[cmd]) {
//     commands[cmd](args, props);
//   } else {
//     props.addOutput(`Command not found: ${cmd}`);
//   }
// };

// export default handleCommand;


// src/commands/handleCommand.jsx
import { resolvePath } from '../utils/path';

const commandModules = import.meta.glob('/src/commands/*.jsx', { eager: true });
const commands = {};
for (const path in commandModules) {
  const name = path.split('/').pop().replace('.jsx', '');
  commands[name] = commandModules[path].default;
}

const handleCommand = (rawInput, props) => {
  const [cmd, ...args] = rawInput.match(/(?:"[^"]*")|(?:'[^']*')|\S+/g) || [];
  if (!commands[cmd]) {
    props.addOutput(`Command not found: ${cmd}`);
    return;
  }

  // give every command access to resolvePath + the full fs + cwd
  const enrichedProps = {
    ...props,
    resolvePath: (p) => resolvePath(p, props.fs, props.currentDirectory)
  };

  try {
    commands[cmd](args, enrichedProps);
  } catch (err) {
    props.addOutput(err.message);
  }
};

export default handleCommand;
