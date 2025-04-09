const whoamiCommand = (_, { userName, addOutput }) => addOutput(userName);

export const whoamiMan = () => `
    whoami: Print the current user's username.

    Usage: whoami

    Description: Outputs the username of the account currently logged into the session.

    Example: whoami

`;

export default whoamiCommand;
