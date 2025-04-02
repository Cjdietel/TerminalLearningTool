import { files } from "jszip";

const lsCommand = (args, { currentDirectory, addOutput }) => {

  let flags = args
    .filter(arg => arg.startsWith('-'))
    .flatMap(arg => arg.slice(1).split('').map(flag => `-${flag}`));


  // let directory = currentDirectory
  // console.log(directory)
  if (args.length > 0) {
    // directory = currentDirectory.args[0];
    currentDirectory = currentDirectory[Object.keys(currentDirectory)[0]].content
  }

  let filesAndDirs;
  if (flags.length == 0) {
    filesAndDirs = Object.keys(currentDirectory)
    .filter(name => !currentDirectory[name].is_hidden)
    .map(name => (
      <span>
        <span key={name} style={{ color: currentDirectory[name].is_file ? 'lightblue' : 'inherit', marginRight: '0.5em' }}>
        {name}
        </span>
      </span>
    ));
  } else {
    for (let i = 0; i < flags.length; i++) {
      if (flags[i] === '-l') {
        console.log(flags)
        filesAndDirs = Object.keys(currentDirectory)
        .filter(name => !currentDirectory[name].is_hidden)
        .map(name => (
          <div key={name}>
            {currentDirectory[name].is_file ? 'd' : '-'}
            {currentDirectory[name].permissions.read ? 'r' : '-'}
            {currentDirectory[name].permissions.write ? 'w' : '-'}
            {currentDirectory[name].permissions.execute ? 'x' : '-'}
            {currentDirectory[name].is_file ? ' 1 ' : ' 2 '}
            {currentDirectory[name].date_modified}
            <span> </span>
            <span style={{ color: currentDirectory[name].is_file ? 'lightblue' : 'inherit', marginRight: '0.5em' }}>
              {name}
            </span>
          </div>
        ));
      }
      else if (flags[i] === '-a') {
        // console.log('all files')
        
        filesAndDirs = Object.keys(currentDirectory).map(name => (
          <span>
            <span key={name} style={{ color: currentDirectory[name].is_file ? 'lightblue' : 'inherit', marginRight: '0.5em' }}>
              {name}
            </span>
          </span>
        ));
        filesAndDirs = <div>. .. {filesAndDirs}</div>
      } else {
        console.log('invalid flag')
      }
    }
  }
    addOutput(<div>{filesAndDirs}</div>);
  };
  
  export default lsCommand;
  