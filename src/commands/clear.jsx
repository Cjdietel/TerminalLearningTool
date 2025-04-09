const clearCommand = (_, { setOutput }) => setOutput([]);

export const clearMan = () => `
  clear: Clear the terminal screen.
  
  Usage: clear
  
  Description: Clears all previous commands and output from the terminal, leaving a blank screen.
  
  Example: clear
  `;


export default clearCommand;
