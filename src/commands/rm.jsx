// const rmCommand = (args, { currentDirectory, setCurrentDirectory, addOutput }) => {
//     if (currentDirectory[args[0]]) {
//       const newDirectory = { ...currentDirectory };
//       delete newDirectory[args[0]];
//       setCurrentDirectory(newDirectory);
//       addOutput(`Removed: ${args[0]}`);
//     } else {
//       addOutput(`No such file: ${args[0]}`);
//     }
//   };
  
//   export default rmCommand;
  
const rmCommand = (args, { rm }) => rm(args[0]);

export const rmMan = () => `
    rm: Remove files or directories.

    Usage: rm [options] <file...>

    Description: Deletes one or more files.

    Example: rm myFolder

`;

export default rmCommand;