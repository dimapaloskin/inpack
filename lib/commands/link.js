const Promise = require('bluebird');
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

    /* for (const name in modules) {
      if ({}.hasOwnProperty.call(modules, name)) {
        const module = modules[name];
        const bound = add.bind(this, directory, module.path, {
          pkg: module.package,
          silent: true
        });

        bounds.push(bound);
      }
    } */

    emit('link:add:start');
    const result = await Promise.map(Object.keys(modules), async name => {
      const module = modules[name];

      const result = {
        isRejected: false,
        isFulfilled: false
      };

      try {
        result.value = await add(directory, module.path, {
          pkg: module.package,
          silent: true
        });
        result.isFulfilled = true;
      } catch (err) {
        result.reason = err;
        result.isRejected = true;
        result.module = module;
      }

      return result;
    }, { concurrency: 1 });

    emit('link:add:end');

    const successed = result.filter(({ isFulfilled }) => isFulfilled === true)
      .map(({ value }) => value);
    const failed = result.filter(({ isRejected }) => isRejected === true)
      .map(({ reason, module }) => ({ reason, module }));

    // rewrite only fulfilled modules
    successed.forEach(module => {
      inpackJson.modules[module.name] = module;
    });

    emit('link:write-inpack-json');
    await fs.writeJsonAsync(context.masterConfigPath, inpackJson);

    emit('link:end');
    return {
      successed,
      failed
    };
  } catch (err) {
    throw (err instanceof Error) ? err : new Error(err);
  }
};

module.exports = link;
