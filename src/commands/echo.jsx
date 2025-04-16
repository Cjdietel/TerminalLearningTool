const echoCommand = (args, { echo, addOutput }) => {
    if (args.length === 1) {
      addOutput(args[0].replace(/['"]+/g, ''));
    } else if (args.length >= 3) {
      echo(args[0].replace(/['"]+/g, ''), args[1], args[2]);
    }
    else {
      addOutput('Invalid number of arguments. use "man echo" for more usage information.');
    }
  };
  
  export const echoMan = () => `
    echo: Display a line of text.
    
    Usage: echo [string...]
    
    Description: Outputs the provided string(s) to the standard output, which can include text or environment variable values.
    
    Example: echo "Hello, world!"
  `;

  export default echoCommand;
  