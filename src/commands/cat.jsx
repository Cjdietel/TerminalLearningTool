  const catCommand = (args, { currentDirectory, addOutput }) => {
    const file = currentDirectory[args[0]];
    if (!file?.permissions?.read) {
      addOutput(`Permission denied. Cannot read from ${args[0]}`);
    } else {
      addOutput(<div>{file?.content || `No such file: ${args[0]}`}</div>);
    }
  };
  
  export const catMan = () => `
    cat: Concatenate and display file content.

    Usage: cat [file...]

    Description: Reads each file specified and writes the contents to standard output. If no files are specified, it reads from standard input.

    Example: cat file.txt
  `;

  export default catCommand;
  