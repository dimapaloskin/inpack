const EventEmitter = require('events');
const chalk = require('chalk');
const ora = require('ora');
const Inpack = require('./../');
const InpackError = require('./../utils/error');

const addHelpMessage = ``;

const add = async (cli, inputs) => {
  const directory = cli.flags.master || process.cwd();
  const options = cli.flags;
  const emitter = new EventEmitter();
  const inpack = new Inpack();
  const boundAdd = inpack.add.bind({ emitter });
  const modulePath = inputs[0];

  const spinner = ora(`Get context`);
  spinner.start();

  emitter.on('add:module-names', data => {
    spinner.text = `Name: "${chalk.bold(data.name)}". Name for requiring: "${chalk.bold.underline(data.prefixed)}"`;
    spinner.succeed();
    spinner.text = 'Adding module';
    spinner.start();
  });

  emitter.on('add:context', data => {
    spinner.text = `Master project found in ${chalk.dim(data.masterPath)} `;
    spinner.succeed();
    spinner.text = 'Process module information';
    spinner.start();
  });

  try {
    await boundAdd(directory, modulePath, options);
    spinner.succeed();
    console.log(`${chalk.yellow('✌')} Done`);
  } catch (err) {
    spinner.fail();

    if (!(err instanceof InpackError)) {
      throw err;
    }

    console.log(chalk.red(err.message));
  }

};

module.exports = {
  add,
  addHelpMessage
};
