import cdCommand from '../commands/cd';
import lsCommand from '../commands/ls';
import catCommand from '../commands/cat';
import rmCommand from '../commands/rm';
import clearCommand from '../commands/clear';
import pwdCommand from '../commands/pwd';
import unameCommand from '../commands/uname';
import whoamiCommand from '../commands/whoami';
import wcCommand from '../commands/wc';
import mkdirCommand from '../commands/mkdir';
import rmdirCommand from '../commands/rmdir';
import touchCommand from '../commands/touch';
import echoCommand from '../commands/echo';

const commands = {
  cd: cdCommand,
  ls: lsCommand,
  cat: catCommand,
  rm: rmCommand,
  clear: clearCommand,
  pwd: pwdCommand,
  uname: unameCommand,
  whoami: whoamiCommand,
  wc: wcCommand,
  mkdir: mkdirCommand,
  rmdir: rmdirCommand,
  touch: touchCommand,
  echo: echoCommand
};

const handleCommand = (command, props) => {
  const [cmd, ...args] = command.match(/(?:"[^"]*")|(?:'[^']*')|\S+/g) || [];
  if (commands[cmd]) {
    commands[cmd](args, props);
  } else {
    props.addOutput(`Command not found: ${cmd}`);
  }
};

export default handleCommand;
