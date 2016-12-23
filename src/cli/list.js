const EventEmitter = require('events');
const chalk = require('chalk');
const ora = require('ora');
const Inpack = require('./../lib');
const InpackError = require('./../lib/utils/error');

const listHelpMessage = ``;

const list = async cli => {
  const directory = cli.flags.contextDir || process.cwd();
  const options = cli.flags;
  const emitter = new EventEmitter();
  const inpack = new Inpack();
  const boundList = inpack.list.bind({ emitter });
  const spinner = ora(`Searching for master project`);
  spinner.start();

  emitter.on('info:context', data => {
    spinner.text = `Master project has been found in ${chalk.dim(data.masterPath)}`;
    spinner.succeed();
    spinner.text = 'Collect information';
    spinner.start();
  });

  emitter.on('list:info:module', name => {
    spinner.text = `Get information about "${name}" module`;
  });

  emitter.on('list:info:end', ({ successed, failed }) => {
    spinner.text = `Collected information for ${chalk.bold(successed)} modules. ${chalk.bold(failed)} failed.\n`;
  });

  try {

    const result = await boundList(directory, options);
    spinner.succeed();

    result.successed.forEach(module => {

      if (options.verbose) {
        console.log(`  Module name: ${chalk.bold(module.name)}`);
        if (module.name !== module.prefixedName) {
          console.log(`  Prefixed module name: ${chalk.bold(module.prefixedName)}`);
        }
        if (module.pkgName !== module.name) {
          console.log(`  Module name in package.json: ${chalk.bold(module.pkgName)}`);
        }

        console.log(`  Main file: ${chalk.bold(module.mainFile)}`);
        console.log(`  Relative path: ${chalk.dim(module.relative)}`);
        console.log(`  Absolute path: ${chalk.dim(module.absolute)}`);
        console.log(`  Master project path: ${chalk.dim(module.masterAbsolutePath)}\n`);

        if (module.isLinked) {
          console.log(`  Module "${module.name}" is linked to ${chalk.dim(module.nodeModulePath)}\n`);
        } else {
          console.log(`  Module "${module.name}" is not linked`);
          console.log(`  Will linked into ${chalk.dim(module.nodeModulePath)}`);
          console.log(`  Use ${chalk.dim('inpack link')} or ${chalk.dim('inpack add ' + module.name)} for linking this module\n`);
        }
      } else {
        console.log(`  Module name: ${chalk.bold(module.name)}. Relative path: ${chalk.dim(module.relative)}. Absolute path: ${chalk.dim(module.absolute)}`);
      }

    });

    result.failed.forEach(module => {
      if (module.reason instanceof InpackError) {
        const errorMessage = chalk.red(module.reason.message);
        console.error(`  ${errorMessage}`);
      } else {
        throw module.reason;
      }
    });

    console.log(`\n ${chalk.yellow('✌')} Done`);
  } catch (err) {
    spinner.fail();

    if (!(err instanceof InpackError)) {
      throw err;
    }

    console.log(chalk.red(err.message));
  }

};

module.exports = {
  list,
  listHelpMessage
};
