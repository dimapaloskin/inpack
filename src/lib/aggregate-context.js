const { resolve, join } = require('path');
const constants = require('./constants');
const InpackError = require('./utils/error');
const fs = require('./utils/fs');

const isInpackJsonAccessible = async directory => {

  let isAccessible = true;

  const R_OK = (fs.constants && fs.constants.R_OK) ? fs.constants.R_OK : 4;
  try {
    await fs.accessAsync(join(directory, constants.inpackConfigName), R_OK);
  } catch (err) {
    isAccessible = false;
  }

  return isAccessible;
};

const getInpackJson = async directory => {

  try {
    const path = join(directory, constants.inpackConfigName);
    return await fs.readJsonAsync(path);
  } catch (err) {
    return null;
  }

};

const getPackageJson = async directory => {

  try {
    const pkgPath = join(directory, 'package.json');
    return await fs.readJsonAsync(pkgPath);
  } catch (err) {
    return null;
  }

};

const detectMaster = async directory => {

  const parentDirectory = resolve(join(directory, '../'));

  if (parentDirectory === directory) {
    return null;
  }

  const isMaster = await isInpackJsonAccessible(parentDirectory);
  if (isMaster) {
    return parentDirectory;
  }

  return await detectMaster(parentDirectory);
};

module.exports = async (directory, options) => {

  try {

    if (!options) {
      options = {};
    }

    if (!directory || typeof directory !== 'string') {
      throw new InpackError('Wrong directory passed');
    }

    let stat;
    try {
      stat = await fs.statAsync(directory);
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new InpackError('Passed directory does not exist');
      }

      throw new Error(err);
    }

    if (!stat.isDirectory()) {
      throw new InpackError('Passed path is not a directory');
    }

    const ctx = {
      directory,
      isMaster: false,
      isChild: false,
      inpack: null,
      masterConfigPath: null,
      masterPath: null
    };

    directory = resolve(directory);

    ctx.pkg = await getPackageJson(directory);
    ctx.isMaster = await isInpackJsonAccessible(directory);

    if (ctx.isMaster) {
      ctx.masterPath = directory;
      ctx.inpack = await getInpackJson(directory);
    } else if (options.preventDetectMaster) {
      ctx.isChild = true;
    } else {
      ctx.masterPath = await detectMaster(directory);
      if (ctx.masterPath) {
        ctx.isChild = true;
      }
    }

    if (ctx.masterPath) {
      ctx.masterConfigPath = join(ctx.masterPath, constants.inpackConfigName);
      if (!ctx.inpack) {
        ctx.inpack = await getInpackJson(ctx.masterPath);
      }

      if (!ctx.pkg) {
        ctx.pkg = await getPackageJson(ctx.masterPath);
      }
    }

    return ctx;
  } catch (err) {
    throw (err instanceof Error) ? err : new Error(err);
  }
};
