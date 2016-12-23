const chalk = require('chalk');
const ora = require('ora');
const Inpack = require('./../lib');
const InpackError = require('./../lib/utils/error');

const infoHelpMessage = ``;

const info = async (cli, moduleName) => {
  const directory = cli.flags.contextDir || process.cwd();
  const options = cli.flags;
  const inpack = new Inpack();
  const spinner = ora(`Getting information for "${moduleName}" module`);
  spinner.start();

  try {
    const result = await inpack.info(directory, moduleName, options);
    spinner.succeed();
    console.log(`\n  Module name: ${chalk.bold(result.name)}`);
    if (result.name !== result.prefixedName) {
      console.log(`  Prefixed module name: ${chalk.bold(result.prefixedName)}`);
    }
    if (result.pkgName !== result.name) {
      console.log(`  Module name in package.json: ${chalk.bold(result.pkgName)}`);
    }

    console.log(`  Main file: ${chalk.bold(result.mainFile)}`);
    console.log(`  Relative path: ${chalk.dim(result.relative)}`);
    console.log(`  Absolute path: ${chalk.dim(result.absolute)}`);
    console.log(`  Master project path: ${chalk.dim(result.masterAbsolutePath)}\n`);

    if (result.isLinked) {
      console.log(`  Module "${result.name}" is linked to ${chalk.dim(result.nodeModulePath)}\n`);
    } else {
      console.log(`  Module "${result.name}" is not linked`);
      console.log(`  Will linked into ${chalk.dim(result.nodeModulePath)}`);
      console.log(`  Use ${chalk.dim('inpack link')} or ${chalk.dim('inpack add ' + result.name)} for linking this module\n`);
    }

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
  info,
  infoHelpMessage
};
