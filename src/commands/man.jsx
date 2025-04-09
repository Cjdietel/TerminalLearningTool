const commandModules = import.meta.glob('/src/commands/*.jsx', { eager: true });

const manCommand = (args, { addOutput }) => {
    const command = args[0];

    if (!command) {
        addOutput("Please specify a command to view its manual.");
        return;
      }
      console.log(command)
      // Dynamically find the `man` function for the specified command
      const module = commandModules[`/src/commands/${command}.jsx`];
      if (module && module[`${command}Man`]) {
        const manFunction = module[`${command}Man`];
        addOutput(<pre>{manFunction()}</pre>);
      } else {
        addOutput(`No manual entry for: ${command}`);
      }
};

export const manMan = () => `
  man: Display the manual for a command.
  
  Usage: man <command>
  
  Description: Opens the manual page for the specified command, providing detailed information on its usage, options, and behavior.
  
  Example: man ls
  `;
    
export default manCommand;