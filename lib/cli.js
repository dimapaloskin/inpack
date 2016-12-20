const EventEmitter = require('events');
const meow = require('meow');
const chalk = require('chalk');
const ora = require('ora');
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

  const inpack = new Inpack();

  if (command === 'init') {
    const directory = cli.flags.master || process.cwd();
    const options = cli.flags;

    const spinner = ora(`Initialize new inpack project`);
    spinner.start();

    try {
      const result = await inpack.init(directory, options);
      spinner.succeed();
      console.log(`${chalk.yellow('✌')} Done\n`);
      console.log(`  Project "${chalk.magenta.bold(result.inpack.name)}" successfully initialized`);
      if (result.inpack.prefix) {
        console.log(`  All required modules should has "${chalk.bold.underline(result.inpack.prefix)}" prefix`);
      }
      console.log(`  Use ${chalk.bold('inpack add <relative directory path>')} to add new module into project.\n`);
    } catch (err) {
      spinner.fail();
      if (err.type && err.type === 'inpack') {
        console.log(chalk.red(err.message));
        return;
      }

      throw err;
    }
  }

  if (command === 'add') {
    const directory = cli.flags.master || process.cwd();
    const options = cli.flags;
    const emitter = new EventEmitter();
    const add = inpack.add.bind({ emitter });
    const modulePath = inputs[0];

    const spinner = ora(`Resolving "${(modulePath) ? modulePath : directory}"`);
    spinner.start();

    emitter.on('add:module-names', data => {
      spinner.succeed();
      spinner.text = `Module "${chalk.bold(data.name)}" will available to require as "${chalk.bold.underline(data.prefixed)}"`;
      spinner.start();
    });

    emitter.on('add:context', data => {
      spinner.succeed();
      spinner.text = `Adding module into ${chalk.dim(data.masterPath)} master project`;
      spinner.start();
    });

    await add(directory, modulePath, options);
    spinner.succeed();
    console.log(`${chalk.yellow('✌')} Done`);
  }

  if (command === 'remove') {
    const options = cli.flags;

    const result = await inpack.remove(process.cwd(), inputs[0], options);
    console.log(result);
  }

  // console.log(cli);
};
