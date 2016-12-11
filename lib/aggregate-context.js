const { resolve, join } = require('path');
const InpackError = require('./utils/error');
const fs = require('./utils/fs');

const isInpackJsonAccessible = async directory => {

  let isAccessible = true;

  try {
    await fs.accessAsync(join(directory, 'inpack.json'), fs.constants.R_OK);
  } catch (err) {
    isAccessible = false;
  }

  return isAccessible;
};

const getInpackJson = async directory => {

  try {
    const path = join(directory, 'inpack.json');
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

module.exports = async directory => {

  if (!directory || typeof directory !== 'string') {
    throw new InpackError('Incorrect directory passed');
  }

  const stat = await fs.statAsync(directory);

  if (!stat.isDirectory()) {
    throw new InpackError('Passed path is not directory');
  }

  const ctx = {
    directory,
    isMaster: false,
    isChild: false,
    inpack: null
  };

  try {
    directory = resolve(directory);

    ctx.pkg = await getPackageJson(directory);
    ctx.isMaster = await isInpackJsonAccessible(directory);

    if (ctx.isMaster) {
      ctx.masterPath = directory;
      ctx.inpack = await getInpackJson(directory);
    } else {
      ctx.masterPath = await detectMaster(directory);
      if (ctx.masterPath) {
        ctx.isChild = true;
      }
    }

    return ctx;
  } catch (err) {
    throw (err instanceof Error) ? err : new Error(err);
  }
};
