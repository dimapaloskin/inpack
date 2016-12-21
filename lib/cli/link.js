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
    spinner.text = `Found ${Object.keys(data).length} modules`;
  });

  emitter.on('link:module', name => {
    spinner.text = `Linking ${name} module`;
  });

  emitter.on('link:modules:end', () => {
    spinner.text = 'Linking modules';
    spinner.succeed();
  });

  try {
    const result = await boundLink(directory);

    console.log(`\n  Successed: ${chalk.bold(result.successed.length)}. Failed: ${chalk.bold(result.failed.length)}`);

    result.failed.forEach(module => {
      if (module.reason instanceof InpackError) {
        const errorMessage = chalk.red(module.reason.message);
        console.error(`  ${errorMessage}`);
      } else {
        throw module.reason;
      }
    });

    console.log(`\n${chalk.yellow('✌')} Done`);
  } catch (err) {
    spinner.fail();

    if (!(err instanceof InpackError) || !err.message) {
      throw err;
    }

    const errorMessage = chalk.red(err.message);
    console.error(errorMessage);
  }

};

module.exports = {
  link,
  linkHelpMessage
};
