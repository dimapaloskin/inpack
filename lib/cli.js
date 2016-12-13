const meow = require('meow');
const Inpack = require('./');

const cli = meow(`

  CLI HELP

`);

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

  inpack.init(process.cwd(), options);
}

console.log(cli);
