const { resolve, join } = require('path');
const nativeFs = require('fs');
const Promise = require('bluebird');

const fs = Promise.promisifyAll(nativeFs);

const isPackageJsonAccessible = async directory => {

  let isAccessible = true;

  try {
    await fs.accessAsync(join(directory, 'package.json'), fs.constants.R_OK);
  } catch (err) {
    isAccessible = false;
  }

  return isAccessible;
};

module.exports = async ({ directory }) => {

  const ctx = {
    directory
  };

  try {
    directory = resolve(directory);

    ctx.isMaster = await isPackageJsonAccessible(directory);
    if (ctx.isMaster) {
      ctx.masterPath = directory;
    }

    return ctx;
  } catch (err) {
    throw new Error(err);
  }
};
