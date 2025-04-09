const pwdCommand = (_, { currentPath, addOutput }) => addOutput(currentPath);

export const pwdMan = () => `
    pwd: Print the current working directory.

    Usage: pwd

    Description: Displays the full path of the current working directory.

    Example: pwd
    
`;

export default pwdCommand;
