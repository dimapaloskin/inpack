const { relative, basename, join } = require('path');
const debug = require('debug')('inpack:remove');
const aggregateContext = require('./../aggregate-context');
const InpackError = require('./../utils/error');
const fs = require('./../utils/fs');

const remove = async (directory, moduleName, options) => {

  debug('with arguments', directory, moduleName, options);
  try {

    if (!options && typeof moduleName === 'object') {
      options = moduleName;
      moduleName = undefined;
    }

    if (!options) {
      options = {};
    }

    const context = await aggregateContext(directory);

    if (!context.masterConfigPath || !context.masterPath) {
      throw new InpackError('Master project is not found');
    }

    if (!moduleName) {
      moduleName = basename(relative(context.masterPath, directory));
    }

    const inpackJson = await fs.readJsonAsync(context.masterConfigPath);
    const extractedModuleData = (inpackJson.modules && inpackJson.modules[moduleName]) ? inpackJson.modules[moduleName] : undefined;

    debug('inpack.json module data', extractedModuleData);

    if (!extractedModuleData && !options.force) {
      throw new InpackError(`${moduleName} was not found in the inpack configuration file. Use --force options to ignore it`);
    }

    const prefixedName = `${inpackJson.prefix || ''}${moduleName}`;
    const nodeModulePath = join(context.masterPath, 'node_modules', prefixedName);

    debug('trying remove module from node_modules');
    await fs.removeAsync(nodeModulePath);

    if (extractedModuleData) {
      debug('remove data from inpack.json');
      delete inpackJson.modules[moduleName];
      await fs.writeJsonAsync(context.masterConfigPath, inpackJson);
    }

    return {
      name: moduleName,
      path: nodeModulePath,
      inpack: inpackJson
    };
  } catch (err) {
    throw (err instanceof Error) ? err : new Error(err);
  }
};

module.exports = remove;
