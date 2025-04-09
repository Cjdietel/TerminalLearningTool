const unameCommand = (_, { addOutput }) => addOutput('Linux');

export const unameMan = () => `
    uname: Print system information.

    Usage: uname [options]

    Description: Displays information about the operating system.

    Example: uname

`;

export default unameCommand;
