const meow = require('meow');
const chalk = require('chalk');
const pkg = require('./../../package.json');
const { init } = require('./init');
const { add } = require('./add');
const { remove } = require('./remove');

module.exports = async () => {
  const cli = meow(`

    inpack - module manager

    Usage: inpack <command>

    Available commands:
      ${chalk.bold('help')} - shown this text
      init - initialize new inpack master project
      add - add new directory as a modulet
      remove - remove module
      link - link all modules from inpack.json
      resolve - show indoramtion about choosen module or about all modules

    Use help <command> for get help on <command>

    inpack@${pkg.version}`,
    {
      boolean: 'create'
    });

  const availableCommads = ['add', 'remove', 'link', 'init', 'info', 'resolve'];

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

  if (command === 'init') {
    init(cli);
  }

  if (command === 'add') {
    add(cli, inputs);
  }

  if (command === 'remove') {
    remove(cli, inputs[0]);
  }

  // console.log(cli);
};
