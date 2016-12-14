const { join, basename } = require('path');
const debug = require('debug')('inpack:init');
const aggregateContext = require('./../aggregate-context');
const fs = require('./../utils/fs');
const constants = require('./../constants');
const InpackError = require('./../utils/error');

const getInstallCommand = previous => {

  let command = previous;
  if (!command) {
    command = constants.postinstallCommand;
  } else if (typeof command === 'string' && !command.startsWith(constants.postinstallCommand)) {
    command = `${constants.postinstallCommand} && ${command}`;
  }

  return command;
};

const init = async (directory, options = constants.defaultInpackOptions) => {

  debug('with arguments', directory, options);
  try {
    const context = await aggregateContext(directory);

    if (!context.pkg) {
      throw new InpackError('Can not be initialized. Directory must contain package.json');
    }

    const projectDirectoryName = basename(directory);
    const inpackConfigPath = join(context.directory, constants.inpackConfigName);

    let inpackJson = {};

    debug('is master project already exists', context.isMaster);
    if (context.isMaster) {
      inpackJson = await fs.readJsonAsync(inpackConfigPath);
    }

    inpackJson.name = options.name || inpackJson.name || projectDirectoryName;
    inpackJson.prefix = options.prefix || inpackJson.prefix || `${projectDirectoryName}-`;

    if (options.prefix === false) {
      delete inpackJson.prefix;
    }

    if (!{}.hasOwnProperty.call(inpackJson, 'modules')) {
      inpackJson.modules = {};
    }

    debug('master project name', inpackJson.name);
    debug('master project prefix', inpackJson.prefix);

    debug('writing inpack.json');
    await fs.writeJsonAsync(inpackConfigPath, inpackJson);

    if (options.addPostinstall) {
      debug('add postinstall');
      const pkgPath = join(directory, 'package.json');
      const pkg = await fs.readJsonAsync(pkgPath);
      const { postinstall } = pkg;

      pkg.postinstall = getInstallCommand(postinstall);
      debug('writing package.json');
      await fs.writeJsonAsync(pkgPath, pkg);
    }

    return {
      inpack: inpackJson,
      configPath: inpackConfigPath
    };

  } catch (err) {
    throw (err instanceof Error) ? err : new Error(err);
  }
};

module.exports = init;
