const chalk = require('chalk');
const ora = require('ora');
const Inpack = require('./../');
const InpackError = require('./../utils/error');

const initHelpMessage = ``;

const init = async cli => {
  const directory = cli.flags.contextDir || process.cwd();
  const options = cli.flags;

  const inpack = new Inpack();
  const spinner = ora(`Initializing new inpack project`);
  spinner.start();

  try {
    const result = await inpack.init(directory, options);

    spinner.succeed();

    console.log(`${chalk.yellow('✌')} Done\n`);
    console.log(`  Project "${chalk.magenta.bold(result.inpack.name)}" has been successfully initialized`);
    if (result.inpack.prefix) {
      console.log(`  All required modules should contain "${chalk.bold.underline(result.inpack.prefix)}" prefix`);
    }
    console.log(`  Use ${chalk.bold('inpack add <relative directory path>')} to add new module to the project\n`);
  } catch (err) {
    spinner.fail();

    if (!(err instanceof InpackError)) {
      throw err;
    }

    console.log(chalk.red(err.message));
  }

};

module.exports = {
  init,
  initHelpMessage
};
