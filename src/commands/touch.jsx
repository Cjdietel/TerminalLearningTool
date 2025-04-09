const touchCommand = (args, { touch }) => touch(args[0]);

export const touchMan = () => `
    touch: Create a new file or update file timestamps.

    Usage: touch <file_name>

    Description: Creates an empty file if it does not exist, or updates the access and modification times of an existing file.

    Example: touch newFile.txt

`;


export default touchCommand;
