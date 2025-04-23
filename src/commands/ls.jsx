import React from 'react';

const lsCommand = (args, props) => {
  const { resolvePath, currentDirectory, addOutput } = props;

  const flags = args
    .filter(arg => arg.startsWith('-'))
    .flatMap(arg => arg.slice(1).split('').map(flag => `-${flag}`));
  const nonFlagArgs = args.filter(arg => !arg.startsWith('-'));
  let dirNodeMap = currentDirectory; 

  if (nonFlagArgs.length > 0) {
    const pathStr = nonFlagArgs[0];
    try {
      const { parent, name, node } = resolvePath(pathStr);
      const target = node ?? parent[name];
      if (!target || target.is_file) {
        addOutput(`No such directory: ${pathStr}`);
        return;
      }
      dirNodeMap = target.content;
    } catch (err) {
      addOutput(err.message);
      return;
    }
  }

  let filesAndDirs;
  const entries = Object.entries(dirNodeMap);

  if (flags.length === 0) {
    filesAndDirs = entries
      .filter(([name, item]) => !item.is_hidden)
      .map(([name, item]) => (
        <span key={name} style={{
          color: item.is_file ? 'lightblue' : 'inherit',
          marginRight: '0.5em'
        }}>
          {name}
        </span>
      ));
  } else if (flags.includes('-l')) {
    filesAndDirs = entries
      .filter(([name, item]) => !item.is_hidden)
      .map(([name, item]) => (
        <div key={name}>
          {item.is_file ? '-' : 'd'}
          {item.permissions.read ? 'r' : '-'}
          {item.permissions.write ? 'w' : '-'}
          {item.permissions.execute ? 'x' : '-'}
          {item.is_file ? ' 1 ' : ' 2 '}
          {item.date_modified}
          <span style={{ margin: '0 0.5em' }} />
          <span style={{
            color: item.is_file ? 'lightblue' : 'inherit'
          }}>
            {name}
          </span>
        </div>
      ));
  } else if (flags.includes('-a')) {
    const list = entries.map(([name, item]) => (
      <span key={name} style={{
        color: item.is_file ? 'lightblue' : 'inherit',
        marginRight: '0.5em'
      }}>
        {name}
      </span>
    ));
    filesAndDirs = <div>. .. {list}</div>;
  } else {
    addOutput(`Invalid flag(s): ${flags.join(', ')}`);
    return;
  }
  addOutput(<div>{filesAndDirs}</div>);
};

export const lsMan = () => `
  ls: List directory contents.
  
  Usage: ls [options] [directory]
  
  Description: Displays the files and directories within the specified directory. If no directory is given, it lists the contents of the current directory. Options like -l and -a can be used for detailed views or to show hidden files.
  
  Example: ls -a /home/user
`;

export default lsCommand;
