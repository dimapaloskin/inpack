const { relative, basename, join } = require('path');
const aggregateContext = require('./../aggregate-context');
const InpackError = require('./../utils/error');
const fs = require('./../utils/fs');
const createEmit = require('./../utils/create-emit');

const remove = async function (directory, moduleName, options) {

  try {

    const emit = createEmit(this);

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

    emit('remove:context', context);

    if (!moduleName) {
      moduleName = basename(relative(context.masterPath, directory));
    }

    const inpackJson = await fs.readJsonAsync(context.masterConfigPath);
    const extractedModuleData = (inpackJson.modules && inpackJson.modules[moduleName]) ? inpackJson.modules[moduleName] : undefined;

    if (!extractedModuleData && !options.force) {
      throw new InpackError(`${moduleName} was not found in the inpack configuration file. Use --force options to ignore it`);
    }

    const prefixedName = `${inpackJson.prefix || ''}${moduleName}`;
    const nodeModulePath = join(context.masterPath, 'node_modules', prefixedName);

    await fs.removeAsync(nodeModulePath);

    if (extractedModuleData) {
      delete inpackJson.modules[moduleName];
      await fs.writeJsonAsync(context.masterConfigPath, inpackJson);
    }

    return {
      name: moduleName,
      path: nodeModulePath,
      inpack: inpackJson
    };
  } catch (err) {
    throw (err instanceof Error || err instanceof InpackError) ? err : new Error(err);
  }
};

module.exports = remove;
