const echoCommand = (args, { echo, addOutput }) => {
    if (args.length === 1) {
      addOutput(args[0].replace(/['"]+/g, ''));
    } else if (args.length >= 3) {
      echo(args[0].replace(/['"]+/g, ''), args[1], args[2]);
    }
  };
  
  export default echoCommand;
  