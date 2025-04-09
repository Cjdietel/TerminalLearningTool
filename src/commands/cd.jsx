const cdCommand = (args, { cd }) => cd(args[0]);

export const cdMan = () => `
  cd: Change the current directory.

  Usage: cd <directory>

  Description: Changes the current working directory to the specified directory. If no directory is provided, it typically defaults to the user's home directory.
  
  Example: cd /usr/local
  `;



export default cdCommand;
