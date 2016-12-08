const { resolve, join } = require('path');
const fse = require('fs-extra');
const Promise = require('bluebird');
const SymlyError = require('./utils/error');

const fs = Promise.promisifyAll(fse);

const isSymlyJsonAccessible = async directory => {

  let isAccessible = true;

  try {
    await fs.accessAsync(join(directory, 'symly.json'), fs.constants.R_OK);
  } catch (err) {
    isAccessible = false;
  }

  return isAccessible;
};

const getSymlyJson = async directory => {

  try {
    const symlyPath = join(directory, 'symly.json');
    await fs.accessAsync(symlyPath, fs.constants.R_OK);
    return await fs.readJsonAsync(symlyPath);
  } catch (err) {
    return null;
  }

};

const getPackageJson = async directory => {

  try {
    const pkgPath = join(directory, 'package.json');
    await fs.accessAsync(pkgPath, fs.constants.R_OK);
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

  const isMaster = await isSymlyJsonAccessible(parentDirectory);
  if (isMaster) {
    return parentDirectory;
  }

  return await detectMaster(parentDirectory);
};

module.exports = async ({ directory }) => {

  if (!directory || typeof directory !== 'string') {
    throw new SymlyError('Incorrect directory passed');
  }

  const ctx = {
    directory,
    isMaster: false,
    isChild: false,
    symly: null
  };

  try {
    directory = resolve(directory);

    ctx.pkg = await getPackageJson(directory);
    ctx.isMaster = await isSymlyJsonAccessible(directory);

    if (ctx.isMaster) {
      ctx.masterPath = directory;
      ctx.symly = await getSymlyJson(directory);
    } else {
      ctx.masterPath = await detectMaster(directory);
      if (ctx.masterPath) {
        ctx.isChild = true;
      }
    }

    return ctx;
  } catch (err) {
    throw new Error(err);
  }
};
