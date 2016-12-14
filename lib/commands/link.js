const Promise = require('bluebird');
const reflect = require('p-reflect');
const add = require('./add');
const aggregateContext = require('./../aggregate-context');
const InpackError = require('./../utils/error');
const fs = require('./../utils/fs');
const createEmit = require('./../utils/create-emit');

const link = async function (directory) {

  try {
    const emit = createEmit(this);
    const context = await aggregateContext(directory);

    if (!context.isMaster) {
      throw new InpackError('Current directory is not the inpack master project');
    }

    emit('link:start');
    const inpackJson = await fs.readJsonAsync(context.masterConfigPath);
    const { modules } = inpackJson;
    emit('link:modules', modules);

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

    emit('link:add:start');
    const result = await Promise.map(bounds, bound => {
      const promise = bound();

      promise.catch(err => {
        emit('link:add:reject', err);
      });

      promise.then(result => {
        emit('link:add:resolve', result);
      });

      return reflect(promise);
    }, { concurrency: 10 });

    emit('link:end:end');
    emit('link:end');
    return result;
  } catch (err) {
    throw (err instanceof Error) ? err : new Error(err);
  }
};

module.exports = link;
