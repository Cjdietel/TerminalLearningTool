const lsCommand = (_, { currentDirectory, addOutput }) => {
    const filesAndDirs = Object.keys(currentDirectory).map(name => (
      <span key={name} style={{ color: currentDirectory[name] instanceof Object ? 'lightblue' : 'inherit', marginRight: '0.5em' }}>
        {name}
      </span>
    ));
    addOutput(<div>{filesAndDirs}</div>);
  };
  
  export default lsCommand;
  