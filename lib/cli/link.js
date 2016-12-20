const EventEmitter = require('events');
const chalk = require('chalk');
const ora = require('ora');
const Inpack = require('./../');
const InpackError = require('./../utils/error');

const linkHelpMessage = ``;

const link = async cli => {
  const directory = cli.flags.contextDir || process.cwd();
  const emitter = new EventEmitter();
  const inpack = new Inpack();
  const boundLink = inpack.link.bind({ emitter });
  const spinner = ora(`Find master project`);
  spinner.start();

  emitter.on('link:context', data => {
    spinner.text = `Master project found in ${chalk.dim(data.masterPath)}`;
    spinner.succeed();
    spinner.text = 'Get modules';
    spinner.start();
  });

  emitter.on('link:modules', data => {
    spinner.text = `Read ${Object.keys(data).length} modules`;
    spinner.succeed();
    spinner.text = 'Linking modules';
    spinner.start();
  });

  emitter.on('link:module', name => {
    spinner.text = `Link ${name} module`;
  });

  emitter.on('link:modules:end', () => {
    spinner.text = 'Linking modules';
    spinner.succeed();
  });

  try {
    const result = await boundLink(directory);
    console.log(result);
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
  link,
  linkHelpMessage
};
