const wcCommand = (args, { currentDirectory, addOutput }) => {
    const fileContent = currentDirectory[args[0]]?.content || '';
    addOutput(`${fileContent.split('\n').length} ${fileContent.split(' ').length} ${fileContent.length} ${args[0]}`);
  };

  export const wcMan = () => `
    wc: Count words, lines, and bytes.

    Usage: wc <file>

    Description: Prints the number of lines, words, and bytes for a file.

    Example: wc file.txt

`;
  
  export default wcCommand;
  