  const catCommand = (args, { currentDirectory, addOutput }) => {
    const file = currentDirectory[args[0]];
    if (!file?.permissions?.read) {
      addOutput(`Permission denied. Cannot read from ${args[0]}`);
    } else {
      addOutput(<div>{file?.content || `No such file: ${args[0]}`}</div>);
    }
  };
  
  export default catCommand;
  