const Promise = require('bluebird');
const reflect = require('p-reflect');
const add = require('./add');
const aggregateContext = require('./../aggregate-context');
const InpackError = require('./../utils/error');
const fs = require('./../utils/fs');

const link = async directory => {

  const context = await aggregateContext(directory);

  if (!context.isMaster) {
    throw new InpackError('Current directory is not the inpack master project');
  }

  const inpackJson = await fs.readJsonAsync(context.masterConfigPath);
  const { modules } = inpackJson;

  const bounds = [];

  for (const name in modules) {
    if ({}.hasOwnProperty.call(modules, name)) {
      const module = modules[name];
      const bound = add.bind(this, directory, module.path, {
        pkg: module.package
      });

      bounds.push(bound);
    }
  }

  const result = await Promise.map(bounds, bound => {
    const promise = bound();

    promise.catch((err => {
      promise.log(err);
    }));

    return reflect(promise);
  }, { concurrency: 10 }); // count of maximum working promises

  console.log(result);
  return directory;
};

module.exports = link;
