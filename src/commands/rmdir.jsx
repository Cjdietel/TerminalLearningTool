const rmdirCommand = (args, { rmdir }) => rmdir(args[0]);

export const rmdirMan = () => `
    rmdir: Remove an empty directory.

    Usage: rmdir <directory>

    Description: Deletes the specified directory.

    Example: rmdir myFolder

`;

export default rmdirCommand;
