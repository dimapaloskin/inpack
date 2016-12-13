const { posix: { join, basename } } = require('path');
const aggregateContext = require('./aggregate-context');
const fs = require('./utils/fs');
const constants = require('./constants');
const InpackError = require('./utils/error');

const init = async (directory, options = constants.defaultInpackOptions) => {

  try {
    const context = await aggregateContext(directory);

    if (!context.pkg) {
      throw new InpackError('Can not be initialized. Directory must contain package.json');
    }

    const projectDirectoryName = basename(directory);
    const inpackConfigPath = join(context.directory, constants.inpackConfigName);

    let inpackJson = {};

    if (context.isMaster) {
      inpackJson = await fs.readJsonAsync(inpackConfigPath);
    }

    inpackJson.name = options.name || inpackJson.name || projectDirectoryName;
    inpackJson.prefix = options.prefix || inpackJson.prefix || `${projectDirectoryName}-`;

    if (options.noPrefix) {
      delete inpackJson.prefix;
    }

    await fs.writeJsonAsync(inpackConfigPath, inpackJson);

    if (options.addPostinstall) {
      const pkgPath = join(directory, 'package.json');
      const pkg = await fs.readJsonAsync(pkgPath);
      let { postinstall } = pkg;

      if (!postinstall) {
        postinstall = constants.postinstallCommand;
      } else if (typeof postinstall === 'string') {
        postinstall = `${constants.postinstallCommand} && ${postinstall}`;
      }

      pkg.postinstall = postinstall;
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
