import { files } from "jszip";

const lsCommand = (args, { currentDirectory, addOutput }) => {

  let flags = args
    .filter(arg => arg.startsWith('-'))
    .flatMap(arg => arg.slice(1).split('').map(flag => `-${flag}`));
  let filesAndDirs;
  if (flags.length == 0) {
    filesAndDirs = Object.keys(currentDirectory).map(name => (
      <span key={name} style={{ color: currentDirectory[name].is_file ? 'lightblue' : 'inherit', marginRight: '0.5em' }}>
        {name}
      </span>
    ));
  } else {
    for (let i = 0; i < flags.length; i++) {
      if (flags[i] === '-l') {
        console.log(flags)
        filesAndDirs = Object.keys(currentDirectory).map(name => (
          <div key={name}>
            {currentDirectory[name].is_file ? 'd' : '-'}
            {currentDirectory[name].permissions.read ? 'r' : '-'}
            {currentDirectory[name].permissions.write ? 'w' : '-'}
            {currentDirectory[name].permissions.execute ? 'x' : '-'}
            {currentDirectory[name].is_file ? ' 1 ' : ' 2 '}
            {currentDirectory[name].date_modified}
            <span style={{ color: currentDirectory[name].is ? 'lightblue' : 'inherit', marginRight: '0.5em' }}>
              {name}
            </span>
          </div>
        ));
      }
      else if (flags[i] === '-a') {
        console.log('all files')
      }
      else {
        console.log('invalid flag')
      }
    }
  }
    addOutput(<div>{filesAndDirs}</div>);
  };
  
  export default lsCommand;
  