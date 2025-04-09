const mkdirCommand = (args, { mkdir }) => mkdir(args[0]);
    export const mkdirMan = () => `
    mkdir: Create a new directory.

    Usage: mkdir <directory_name>

    Description: Creates a new directory with the specified name in the current directory.

    Example: mkdir myFolder
    
`;
export default mkdirCommand;
