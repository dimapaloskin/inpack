const { relative, join } = require('path');
const InpackError = require('./utils/error');
const fs = require('./utils/fs');

const modulePathResolver = async (directory, path, context) => {

  try {
    if (!path) {
      path = relative(context.masterPath, directory);
    }

    const relativeModulePath = path;
    const absoluteModulePath = join(context.masterPath, path);

    let isExists = true;
    let isWritable = false;
    let isReadable = false;

    try {
      const stat = await fs.statAsync(absoluteModulePath);

      if (!stat.isDirectory()) {
        throw new InpackError('Module path is not directory');
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        isExists = false;
      } else {
        throw new Error(err);
      }
    }

    let packageJson = {};
    if (isExists) {

      try {
        packageJson = await fs.readJsonAsync(join(absoluteModulePath, 'package.json'));
      } catch (err) {
        packageJson = {};
      }

      try {
        await fs.accessAsync(absoluteModulePath, fs.constants.R_OK);
        isReadable = true;
      } catch (err) {
        isReadable = false;
      }

      try {
        await fs.accessAsync(absoluteModulePath, fs.constants.W_OK);
        isWritable = true;
      } catch (err) {
        isWritable = false;
      }
    }

    if (typeof packageJson === 'object') {
      delete packageJson.name;
    }

    return {
      absolute: absoluteModulePath,
      relative: relativeModulePath,
      masterAbsolutePath: context.masterPath,
      exists: isExists,
      readable: isReadable,
      writable: isWritable,
      packageJson
    };

  } catch (err) {
    throw (err instanceof Error) ? err : new Error(err);
  }
};

module.exports = modulePathResolver;
