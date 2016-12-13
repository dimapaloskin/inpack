const meow = require('meow');
const Inpack = require('./');

module.exports = async () => {
  const cli = meow(`

    CLI HELP

  `, {
    boolean: 'create'
  });

  const availableCommads = ['add', 'remove', 'link', 'init'];

  const inputs = cli.input;
  const command = inputs.shift();

  if (!command) {
    cli.showHelp();
  }

  if (command === 'help' && inputs.length === 0) {
    cli.showHelp();
  }

  if (!availableCommads.includes(command)) {
    console.log(`\n  Command "${command}" is not recognized`);
    cli.showHelp();
  }

  const inpack = new Inpack();

  if (command === 'init') {
    const options = cli.flags;

    const result = await inpack.init(process.cwd(), options);
    console.log(result);
  }

  if (command === 'add') {
    const options = cli.flags;

    const result = await inpack.add(process.cwd(), inputs[0], options);
    console.log(result);
  }

  if (command === 'remove') {
    const options = cli.flags;

    const result = await inpack.remove(process.cwd(), inputs[0], options);
    console.log(result);
  }

  console.log(cli);
};
