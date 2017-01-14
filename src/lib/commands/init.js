const { join, basename } = require('path');
const aggregateContext = require('./../aggregate-context');
const fs = require('./../utils/fs');
const constants = require('./../constants');
const InpackError = require('./../utils/error');

const getInstallCommand = function (command) {

  if (!command) {
    command = constants.postinstallCommand;
  } else if (typeof command === 'string' && !command.startsWith(constants.postinstallCommand)) {
    command = `${constants.postinstallCommand} && ${command}`;
  }

  return command;
};

const init = async function (directory, options = constants.defaultInpackOptions) {

  try {

    const context = await aggregateContext(directory, { preventDetectMaster: true });

    if (!context.pkg) {
      throw new InpackError('Can not be initialized. The directory must contain package.json');
    }

    const projectDirectoryName = basename(directory);
    const inpackConfigPath = join(context.directory, constants.inpackConfigName);

    let inpackJson = {};

    if (context.isMaster) {
      inpackJson = await fs.readJsonAsync(inpackConfigPath);
    }

    inpackJson.name = options.name || inpackJson.name || projectDirectoryName;
    inpackJson.prefix = options.prefix || inpackJson.prefix;

    if (!options.prefix) {
      delete inpackJson.prefix;
    }

    if (!{}.hasOwnProperty.call(inpackJson, 'modules')) {
      inpackJson.modules = {};
    }

    await fs.writeJsonAsync(inpackConfigPath, inpackJson);

    if (options.addPostinstall) {
      const pkgPath = join(directory, 'package.json');
      const pkg = await fs.readJsonAsync(pkgPath);
      const { postinstall } = pkg;

      pkg.postinstall = getInstallCommand(postinstall);
      await fs.writeJsonAsync(pkgPath, pkg);
    }

    return {
      inpack: inpackJson,
      configPath: inpackConfigPath
    };

  } catch (err) {
    throw (err instanceof Error || err instanceof InpackError) ? err : new Error(err);
  }
};

module.exports = init;
