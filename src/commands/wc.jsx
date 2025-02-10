const wcCommand = (args, { currentDirectory, addOutput }) => {
    const fileContent = currentDirectory[args[0]]?.content || '';
    addOutput(`${fileContent.split('\n').length} ${fileContent.split(' ').length} ${fileContent.length} ${args[0]}`);
  };
  
  export default wcCommand;
  