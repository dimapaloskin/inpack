const EventEmitter = require('events');
const meow = require('meow');
const chalk = require('chalk');
const ora = require('ora');
const sleep = require('async-sleep');
const pkg = require('./../package.json');
const Inpack = require('./');

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
    const directory = cli.flags.master || process.cwd();
    const options = cli.flags;
    const emitter = new EventEmitter();
    const add = inpack.add.bind({ emitter });
    const modulePath = inputs[0];

    const spinnerInitString = `Resolving ${(modulePath) ? modulePath : directory}`;
    const spinner = ora(spinnerInitString);
    spinner.start();

    emitter.on('add:module-names', data => {
      spinner.stopAndPersist(chalk.bold.green('+'));
      spinner.text = `Adding module "${data.name}" as "${data.prefixed}"...`;
      spinner.start();
    });

    const result = await add(directory, modulePath, options);
    spinner.succeed();
    console.log(result);
  }

  if (command === 'remove') {
    const options = cli.flags;

    const result = await inpack.remove(process.cwd(), inputs[0], options);
    console.log(result);
  }

  // console.log(cli);
};
