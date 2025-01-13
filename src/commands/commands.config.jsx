// const commands = {}

// const importCommands = require.context('./commands', false, '/\.jsx$/')

// importCommands.keys().forEach((fileName) => {
//     const commandName = fileName.replace('./', '').replace('.jsx','')
//     commands[commandName] = importCommands(fileName).default;
// });

// // const importCommands = async () => {
// //     const commandModules = import.meta.glob('./commands/*.jsx')
// //     console.log()

// //     for (const path in commandModules) {
// //         const module = await commandModules[path]();
// //         const commandName = path
// //             .replace('.commands/','')
// //             .replace('.jsx','');
// //         commands[commandName] = module.default;
// //     }
// // };

// // await importCommands();

// export default commands;