const commandModules = import.meta.glob('/src/commands/*.jsx', { eager: true });
const commands = {}

for (const path in commandModules) {
  const module = commandModules[path];
  const fileName = path
    .split('/')
    .pop()
    .replace('.jsx', '');
  const commandFunc = module.default;
  const commandVarName = `${fileName}Command`;
  commands[fileName] = commandFunc;
}


const handleCommand = (command, props) => {
  const [cmd, ...args] = command.match(/(?:"[^"]*")|(?:'[^']*')|\S+/g) || []; // regex to break up command into array of substrings
  if (commands[cmd]) {
    commands[cmd](args, props);
  } else {
    props.addOutput(`Command not found: ${cmd}`);
  }
};

export default handleCommand;
