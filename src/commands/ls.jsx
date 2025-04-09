
const lsCommand = (args, { currentDirectory, addOutput }) => {
  const flags = args
    .filter(arg => arg.startsWith('-'))
    .flatMap(arg => arg.slice(1).split('').map(flag => `-${flag}`));

  const nonFlagArgs = args.filter(arg => !arg.startsWith('-'));


  if (nonFlagArgs.length > 0) {
    const folderName = nonFlagArgs[0];
    if (currentDirectory[folderName] && !currentDirectory[folderName].is_file) {

      currentDirectory = currentDirectory[folderName].content;
    } else {
      addOutput(`No such directory: ${folderName}`);
      return;
    }
  }

  let filesAndDirs;

  if (flags.length === 0) {

    filesAndDirs = Object.keys(currentDirectory)
      .filter(name => !currentDirectory[name].is_hidden)
      .map(name => (
        <span key={name} style={{ 
          color: currentDirectory[name].is_file ? 'lightblue' : 'inherit', 
          marginRight: '0.5em' 
        }}>
          {name}
        </span>
      ));
  } else {

    if (flags.includes('-l')) {
      filesAndDirs = Object.keys(currentDirectory)
        .filter(name => !currentDirectory[name].is_hidden)
        .map(name => {
          const item = currentDirectory[name];
          return (
            <div key={name}>
              {item.is_file ? '-' : 'd'}
              {item.permissions.read ? 'r' : '-'}
              {item.permissions.write ? 'w' : '-'}
              {item.permissions.execute ? 'x' : '-'}
              {item.is_file ? ' 1 ' : ' 2 '}
              {item.date_modified}
              <span style={{ margin: '0 0.5em' }}></span>
              <span style={{ 
                color: item.is_file ? 'lightblue' : 'inherit'
              }}>
                {name}
              </span>
            </div>
          );
        });
    } else if (flags.includes('-a')) {
      filesAndDirs = Object.keys(currentDirectory)
        .map(name => (
          <span key={name} style={{ 
            color: currentDirectory[name].is_file ? 'lightblue' : 'inherit', 
            marginRight: '0.5em' 
          }}>
            {name}
          </span>
        ));

      filesAndDirs = <div>. .. {filesAndDirs}</div>;
    } else {
      console.log('invalid flag');
    }
  }
  
  addOutput(<div>{filesAndDirs}</div>);
};

export default lsCommand;
