const meow = require('meow');
const chalk = require('chalk');
const pkg = require('./../../package.json');
const { init } = require('./init');
const { add } = require('./add');
const { remove } = require('./remove');
const { link } = require('./link');
const { info } = require('./info');
const { list } = require('./list');

module.exports = async () => {
  // Use help <command> to get more information about <command>
  const cli = meow(`

    inpack - nodejs invisible modules manager

    Usage: inpack <command>

    Available commands:

      ${chalk.bold('help')} - show this text
      ${chalk.bold('init')} - initialize new inpack master project
      ${chalk.bold('add')} <relative/path> - add directory as a module
      ${chalk.bold('remove')} <module_name> - remove module
      ${chalk.bold('link')} - link all modules from inpack.json
      ${chalk.bold('info')} <module_name> - show inforamtion about module
      ${chalk.bold('list')} - provide information about all modules

    inpack@${pkg.version}`,
    {
      boolean: 'create'
    });

  const availableCommads = ['add', 'remove', 'link', 'init', 'info', 'resolve', 'list'];

  const inputs = cli.input;
  const command = inputs.shift();

  if (!command) {
    cli.showHelp();
  }

  if (command === 'help' && inputs.length === 0) {
    cli.showHelp();
  }

  if (availableCommads.indexOf(command) === -1) {
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

  if (command === 'link') {
    link(cli);
  }

  if (command === 'info' || command === 'resolve') {
    info(cli, inputs[0]);
  }

  if (command === 'list') {
    list(cli);
  }

  // console.log(cli);
};
