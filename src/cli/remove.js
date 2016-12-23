const EventEmitter = require('events');
const chalk = require('chalk');
const ora = require('ora');
const Inpack = require('./../lib');
const InpackError = require('./../lib/utils/error');

const removeHelpMessage = ``;

const remove = async (cli, moduleName) => {
  const directory = cli.flags.contextDir || process.cwd();
  const options = cli.flags;
  const emitter = new EventEmitter();
  const inpack = new Inpack();
  const boundRemove = inpack.remove.bind({ emitter });
  const spinner = ora(`Searching for master project`);
  spinner.start();

  emitter.on('remove:context', data => {
    spinner.text = `Master project has been found in ${chalk.dim(data.masterPath)} `;
    spinner.succeed();
    spinner.text = 'Removing the module';
  });

  try {
    const result = await boundRemove(directory, moduleName, options);
    spinner.text = `Module ${chalk.bold.underline(result.name)} has been removed`;
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
  remove,
  removeHelpMessage
};
