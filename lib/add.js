const { relative } = require('path');
const InpackError = require('./utils/error');
const { readJsonAsync } = require('./utils/fs');
const aggregateContext = require('./aggregate-context');

const add = async (directory, path, options) => {

  try {

    if (!options) {
      options = path;
      path = undefined;
    }

    const context = await aggregateContext(directory);

    if (!context.masterConfigPath) {
      throw new InpackError('Master project is not found');
    }

    if (!context.masterPath) {
      throw new InpackError('Master project directory is not found');
    }

    if (!path) {
      path = relative(context.masterPath, directory);
    }

    const inpackJson = readJsonAsync(context.masterConfigPath);
    console.log(inpackJson);

    return context;
  } catch (err) {
    throw (err instanceof Error) ? err : new Error(err);
  }
};

module.exports = add;
