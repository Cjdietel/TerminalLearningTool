const helpCommand = (args, { addOutput }) => {
    const commandModules = import.meta.glob('/src/commands/*.jsx', { eager: true });
    const commands = {};
    addOutput(`
Here are a list of commands currently available to you to explore:
    `);
    for (const path in commandModules) {
        const name = path.split('/').pop().replace('.jsx', '');
        addOutput(name)
    }
    addOutput(`
        
To learn what each command does, use "man <command>".`);
    
    
  };
  
  export const helpMan = () => `
    help: Lists currently available commands
    
    Usage: help
    
    Description: Displays a list of available commands in the system.

    Example: help
  `;

  export default helpCommand;