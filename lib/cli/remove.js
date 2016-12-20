const EventEmitter = require('events');
const chalk = require('chalk');
const ora = require('ora');
const Inpack = require('./../');
const InpackError = require('./../utils/error');

const removeHelpMessage = ``;

const remove = async (cli, moduleName) => {
  const directory = cli.flags.master || process.cwd();
  const options = cli.flags;
  const emitter = new EventEmitter();
  const inpack = new Inpack();
  const boundRemove = inpack.remove.bind({ emitter });
  const spinner = ora(`Get context`);
  spinner.start();

  emitter.on('remove:context', data => {
    spinner.text = `Master project found in ${chalk.dim(data.masterPath)} `;
    spinner.succeed();
    spinner.text = 'Removing module';
  });

  try {
    const result = await boundRemove(directory, moduleName, options);
    spinner.succeed();

    console.log(result);
  } catch (err) {
    spinner.fail();

    if (!(err instanceof InpackError)) {
      throw err;
    }

    console.log(chalk.red(err.message));
  }

};

module.exports = {
  remove,
  removeHelpMessage
};
